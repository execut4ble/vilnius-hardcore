import Redis from "ioredis";
import { randomUUID } from "node:crypto";
import "dotenv/config";

const LOCK_TTL_MS = 60 * 1000; // 1 minute

export const redis = new Redis(
  process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
  {
    // When Redis is unreachable, fail commands fast instead of queueing them
    // in memory: with the default offline queue, a command issued during an
    // outage waits ~45-50s before rejecting, which would stall the layout
    // load that reads the recordings cache (and with it, every page).
    enableOfflineQueue: false,
    // Don't re-run a command if the connection drops mid-request; let the
    // caller's catch block handle it.
    maxRetriesPerRequest: 0,
    // Bound a single command on a live-but-slow connection so it can never
    // hang a page load indefinitely.
    commandTimeout: 2000,
  },
);

export function createLogger(prefix: string): {
  log: (message: string) => void;
  logError: (message: string, err: unknown) => void;
} {
  const stamp = () => new Date().toISOString();
  return {
    log: (message: string) => console.log(`[${prefix}] ${stamp()} ${message}`),
    logError: (message: string, err: unknown) =>
      console.error(`[${prefix}] ${stamp()} ${message}:`, err),
  };
}

const logger = createLogger("redis");
redis.on("error", (err) => logger.logError("redis error", err));

// Atomic compare-and-delete for the refresh lock: a plain GET followed by
// DEL could delete a lock that another worker acquired after ours expired.
const RELEASE_LOCK_SCRIPT = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
end
return 0
`;

async function releaseLock(key: string, token: string): Promise<void> {
  try {
    await redis.eval(RELEASE_LOCK_SCRIPT, 1, key, token);
  } catch (err) {
    // Best-effort: if we cannot release the lock now, it expires on its own
    // after LOCK_TTL_MS.
    logger.logError("failed to release lock", err);
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  const raw = await redis.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlMs?: number,
): Promise<void> {
  const payload = JSON.stringify(value);
  if (ttlMs && ttlMs > 0) {
    await redis.set(key, payload, "PX", ttlMs);
  } else {
    await redis.set(key, payload);
  }
}

/**
 * Refreshes a cache entry using a distributed lock so that only one worker
 * fetches at a time.
 *
 * - `force` bypasses the freshness check and always fetches.
 * - If `staleBeforeMs` is set, the cached value is reused when its `fetchedAt`
 *   timestamp is younger than it.
 * - `fetch` returns the value to store when the cache is stale or forced.
 * - `cacheTtlMs` sets an expiration on the stored value so that stale data
 *   cannot persist forever if the poller dies.
 * - `onSkip(reason)` is called when a fetch is skipped (cache hit or another
 *   worker holds the lock), letting the caller log with its own prefix.
 * - `onFetchFailed(err)` is called when the fetch throws; by default the
 *   error is logged, callers usually pass their own handler to log under
 *   their own prefix.
 */
export async function refreshCached<T>({
  cacheKey,
  lockKey,
  staleBeforeMs = 0,
  cacheTtlMs,
  force = false,
  fetch,
  onSkip = () => {},
  onFetchFailed = (err) => logger.logError("refresh failed", err),
}: {
  cacheKey: string;
  lockKey: string;
  staleBeforeMs?: number;
  cacheTtlMs?: number;
  force?: boolean;
  fetch: () => Promise<T>;
  onSkip?: (reason: string, info?: unknown) => void;
  onFetchFailed?: (err: unknown) => void;
}): Promise<void> {
  if (!force && staleBeforeMs > 0) {
    const cached = await getCached<T>(cacheKey);
    if (cached) {
      // The "fetchedAt" timestamp is optional; treat a missing timestamp as
      // "always stale" so a cache without one is always refreshed.
      const fetchedAt = (cached as { fetchedAt?: number }).fetchedAt;
      if (fetchedAt !== undefined && Date.now() - fetchedAt < staleBeforeMs) {
        const ageSec = Math.round((Date.now() - fetchedAt) / 1000);
        onSkip(`cache hit - skipping fetch (cached ${ageSec}s ago)`, cached);
        return;
      }
    }
  }

  // Acquire the lock with a unique token so that only the original holder can
  // release it. If a fetch outlives LOCK_TTL_MS, another worker may take the
  // lock; releaseLock's compare-and-delete prevents this worker from deleting
  // it.
  const token = randomUUID();
  const gotLock = await redis.set(lockKey, token, "PX", LOCK_TTL_MS, "NX");
  if (!gotLock) {
    onSkip("skipping fetch - another worker is already refreshing");
    return;
  }

  try {
    const value = await fetch();
    await setCached(cacheKey, value, cacheTtlMs);
  } catch (err) {
    onFetchFailed(err);
  } finally {
    // Only release the lock if we still own it (atomic compare-and-delete).
    await releaseLock(lockKey, token);
  }
}

/**
 * Runs `refresh` once immediately, then on a fixed interval. The interval is
 * unref'd so it does not keep the process alive on its own.
 */
export function startPolling(
  refresh: () => Promise<void>,
  intervalMs: number,
  onRefreshFailed?: (err: unknown) => void,
): NodeJS.Timeout {
  refresh().catch((err) => onRefreshFailed?.(err));

  const interval = setInterval(() => {
    refresh().catch((err) => onRefreshFailed?.(err));
  }, intervalMs);

  interval.unref?.();
  return interval;
}
