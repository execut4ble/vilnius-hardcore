import Redis from "ioredis";
import "dotenv/config";

/**
 * Reusable Redis helpers: a shared client, a small logger, and generic
 * cache / distributed-lock / polling primitives. Domain-specific code (e.g.
 * parsing the recordings page) lives in its own module and uses these.
 */

// How long a distributed lock lives before auto-expiring, in case a process
// dies mid-operation and never releases it.
const LOCK_TTL_MS = 60 * 1000; // 1 minute

export const redis = new Redis(
  process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
);

/**
 * Creates a prefixed logger. The prefix is included on every line for easy
 * filtering, e.g. `createLogger("recordings")`.
 */
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

/**
 * Reads a JSON-encoded cache entry from Redis, or null if absent.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const raw = await redis.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

/**
 * Writes a JSON-encoded cache entry to Redis.
 */
export async function setCached<T>(key: string, value: T): Promise<void> {
  await redis.set(key, JSON.stringify(value));
}

/**
 * Refreshes a cache entry using a distributed lock so that only one worker
 * fetches at a time.
 *
 * - `force` bypasses the freshness check and always fetches.
 * - If `staleBeforeMs` is set, the cached value is reused when its `fetchedAt`
 *   timestamp is younger than it.
 * - `fetch` returns the value to store when the cache is stale or forced.
 * - `onSkip(reason)` is called when a fetch is skipped (cache hit or another
 *   worker holds the lock), letting the caller log with its own prefix.
 */
export async function refreshCached<T>({
  cacheKey,
  lockKey,
  staleBeforeMs = 0,
  force = false,
  fetch,
  onSkip = () => {},
  onFetchFailed = (err: unknown) => {},
}: {
  cacheKey: string;
  lockKey: string;
  staleBeforeMs?: number;
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

  const gotLock = await redis.set(lockKey, "1", "PX", LOCK_TTL_MS, "NX");
  if (!gotLock) {
    onSkip("skipping fetch - another worker is already refreshing");
    return;
  }

  try {
    const value = await fetch();
    await setCached(cacheKey, value);
  } catch (err) {
    onFetchFailed(err);
    logger.logError("refresh failed", err);
  } finally {
    await redis.del(lockKey);
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
