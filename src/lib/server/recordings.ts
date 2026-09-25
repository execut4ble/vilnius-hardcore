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

const { log, logError } = createLogger("recordings-fetcher");

interface RecordingsCache {
  date: string | null;
  recordings: Recording[];
  fetchedAt: number;
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

    // Force cache refresh if nothing is cached yet
    if (!cached) {
      await refreshCache({ force: true });
      cached = await getCachedRecordings();
    }

    // No data available yet
    if (!cached) {
      return {
        error: "No data available yet",
        date: new Date(),
        recordings: [],
      };
    }
  } catch (err) {
    // Redis (or the upstream fetch) is unavailable. Degrade gracefully so this
    // never breaks the layout load for every page on the site.
    logError("failed to load recordings", err);
    return {
      error: "Error loading data. Please try again later.",
      date: new Date(),
      recordings: [],
    };
  }

  const dateStr = cached.date ?? "00000000";
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1; // JS months are 0-indexed
  const day = parseInt(dateStr.slice(6, 8), 10);

  // Build at noon local time so the date-only value is not subject to an
  // off-by-one day flip from server vs. user timezone boundaries.
  return {
    date: new Date(year, month, day, 12),
    recordings: cached.recordings,
  };
}

async function refreshCache({
  force = false,
}: { force?: boolean } = {}): Promise<void> {
  await refreshCached<RecordingsCache>({
    cacheKey: CACHE_KEY,
    lockKey: LOCK_KEY,
    staleBeforeMs: POLL_INTERVAL_MS,
    cacheTtlMs: CACHE_TTL_MS,
    force,
    onSkip: (reason) => log(reason),
    onFetchFailed: (err) => logError("refresh failed", err),
    fetch: async () => {
      const recordings = await fetchLatestRecordings();
      return {
        date: recordings[0]?.date ?? null,
        recordings,
        fetchedAt: Date.now(),
      };
    },
  });
}

// Guard against duplicate intervals being created when the module is
// re-imported in dev/HMR.
let pollTimer: NodeJS.Timeout | null = null;

export function startPolling(): NodeJS.Timeout {
  if (pollTimer) {
    return pollTimer;
  }

  pollTimer = startPollingGeneric(
    () => refreshCache(),
    POLL_INTERVAL_MS,
    (err) => logError("refresh failed", err),
  );

  return pollTimer;
}
