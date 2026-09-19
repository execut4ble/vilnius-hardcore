import {
  createLogger,
  getCached,
  refreshCached,
  startPolling as startPollingGeneric,
} from "$lib/server/redis";

const SOURCE_URL = "https://mp3.hardcore.lt/1120/";

// Redis keys
const CACHE_KEY = "recordings:latest";
const LOCK_KEY = "recordings:poll-lock";

// How often the background poller re-fetches the upstream page.
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const { log, logError } = createLogger("recordings-fetcher");

export interface Recording {
  date: string;
  fileName: string;
  title: string;
  fileSize: string;
  url: string;
}

export interface RecordingsCache {
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

export async function getCachedRecordings(): Promise<RecordingsCache | null> {
  return getCached<RecordingsCache>(CACHE_KEY);
}

export async function refreshCache({
  force = false,
}: { force?: boolean } = {}): Promise<void> {
  await refreshCached<RecordingsCache>({
    cacheKey: CACHE_KEY,
    lockKey: LOCK_KEY,
    staleBeforeMs: POLL_INTERVAL_MS,
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

export function startPolling(): NodeJS.Timeout {
  return startPollingGeneric(
    () => refreshCache(),
    POLL_INTERVAL_MS,
    (err) => logError("refresh failed", err),
  );
}
