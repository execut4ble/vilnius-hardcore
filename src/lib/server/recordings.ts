import {
  createLogger,
  getCached,
  refreshCached,
  startPolling as startPollingGeneric,
} from "$lib/server/redis";
import type { LatestRecordingsData, Recording } from "$lib/types";

const SOURCE_URL = "https://mp3.hardcore.lt/1120/";

// Redis keys
const CACHE_KEY = "recordings:latest";
const LOCK_KEY = "recordings:poll-lock";

// How often the background poller re-fetches the upstream page.
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// How long a cached entry stays valid so stale data cannot persist forever if
// the poller process dies.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Bound the upstream fetch so a hanging host can never stall a refresh for
// minutes (undici otherwise allows up to ~5min before giving up).
const FETCH_TIMEOUT_MS = 10 * 1000; // 10 seconds

const { log, logError } = createLogger("recordings-fetcher");

interface RecordingsCache {
  recordings: Recording[];
  fetchedAt: number;
}

/**
 * Parses a YYYYMMDD string into a Date at noon local time (noon so a
 * date-only value is not subject to an off-by-one day flip from server vs.
 * user timezone boundaries), or null if it is not a valid calendar date.
 */
function parseRecordDate(dateStr: string): Date | null {
  if (!/^\d{8}$/.test(dateStr)) return null;

  const year = Number(dateStr.slice(0, 4));
  const month = Number(dateStr.slice(4, 6)); // 1-12
  const day = Number(dateStr.slice(6, 8));
  if (month < 1 || month > 12 || day < 1) return null;

  const date = new Date(year, month - 1, day, 12);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Parses the LIVE@XI20 recordings page. The recordings are listed in the following structure:
 *    <span class="songfile"><a href="20260915 Jakimke.ogg">20260915 Jakimke.ogg</a></span>
 *    <span class="info">[133.29 MB]</span>
 */
function parseRecordings(html: string, baseUrl: string): Recording[] {
  const entries: Recording[] = [];
  const entryRegex =
    /<span class="songfile">\s*<a href="([^"]+)">[^<]*<\/a>\s*<\/span>\s*<span class="info">\[([^\]]+)\]<\/span>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(html)) !== null) {
    const [, href, size] = match;

    const nameMatch = href.match(/^(\d{8})\s+(.+)\.ogg$/i);
    if (!nameMatch) continue; // not a "DATE Title.ogg"-shaped entry

    const [, date, title] = nameMatch;
    if (!parseRecordDate(date)) continue; // not a valid YYYYMMDD date

    entries.push({
      date,
      fileName: href,
      title: title.trim(),
      fileSize: size.trim(),
      url: new URL(href, baseUrl).toString(),
    });
  }

  return entries;
}

async function fetchLatestRecordings(): Promise<Recording[]> {
  const startedAt = Date.now();
  log(`fetching ${SOURCE_URL}`);

  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; recordings-fetcher/1.0)",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Upstream fetch failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const entries = parseRecordings(html, SOURCE_URL);
  const elapsedMs = Date.now() - startedAt;

  if (entries.length === 0) {
    log(`fetch OK (${elapsedMs}ms) - no entries found`);
    return [];
  }

  const latestDate = entries.reduce(
    (max, e) => (e.date > max ? e.date : max),
    entries[0].date,
  );
  const latest = entries.filter((e) => e.date === latestDate);

  log(
    `fetch OK (${elapsedMs}ms) - ${entries.length} entries parsed, ${latest.length} for latest date ${latestDate}`,
  );

  return latest;
}

async function getCachedRecordings(): Promise<RecordingsCache | null> {
  return getCached<RecordingsCache>(CACHE_KEY);
}

export async function getLatestRecordingsData(): Promise<LatestRecordingsData> {
  let cached: RecordingsCache | null;

  try {
    cached = await getCachedRecordings();
  } catch (err) {
    // Redis is unavailable. Degrade gracefully so this never breaks the
    // layout load for every page on the site.
    logError("failed to load recordings", err);
    return {
      error: "Error loading data. Please try again later.",
      date: new Date(),
      recordings: [],
    };
  }

  if (!cached) {
    // No data available yet
    refreshCache().catch((err) => logError("refresh failed", err));
    return {
      error: "No data available yet",
      date: new Date(),
      recordings: [],
    };
  }

  if (cached.recordings.length === 0) {
    // The upstream page was reachable but listed nothing
    return {
      error: "No data available yet",
      date: new Date(),
      recordings: [],
    };
  }

  const date = parseRecordDate(cached.recordings[0].date);
  if (!date) {
    // guard against a stale or corrupted cache entry.
    logError("invalid recording date in cache", cached.recordings[0].date);
    return {
      error: "Error loading data. Please try again later.",
      date: new Date(),
      recordings: [],
    };
  }

  return {
    date,
    recordings: cached.recordings,
  };
}

async function refreshCache(): Promise<void> {
  await refreshCached<RecordingsCache>({
    cacheKey: CACHE_KEY,
    lockKey: LOCK_KEY,
    staleBeforeMs: POLL_INTERVAL_MS,
    cacheTtlMs: CACHE_TTL_MS,
    onSkip: (reason) => log(reason),
    onFetchFailed: (err) => logError("refresh failed", err),
    fetch: async () => {
      const recordings = await fetchLatestRecordings();
      return {
        recordings,
        fetchedAt: Date.now(),
      };
    },
  });
}

// The timer is tracked on globalThis rather than in module state because the
// module is re-evaluated on dev/HMR: a module-level variable would reset on
// reload, leaking the previous interval and registering a duplicate poller.
// Replacing the previous timer on re-import also keeps the running poller on
// the current module's code.
type GlobalWithPollTimer = typeof globalThis & {
  __recordingsPollTimer?: NodeJS.Timeout;
};

export function startPolling(): NodeJS.Timeout {
  const g = globalThis as GlobalWithPollTimer;

  if (g.__recordingsPollTimer) {
    clearInterval(g.__recordingsPollTimer);
  }

  g.__recordingsPollTimer = startPollingGeneric(
    () => refreshCache(),
    POLL_INTERVAL_MS,
    (err) => logError("refresh failed", err),
  );

  return g.__recordingsPollTimer;
}
