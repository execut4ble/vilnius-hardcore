import { readdir, stat, statfs } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { redis } from "$lib/server/redis";
import { FILES_DIR } from "$lib/server/actions/file-upload.actions";

export interface ServerInfo {
  nodeVersion: string;
  platform: string;
  hostname: string;
  cpu: string;
  memoryFree: string;
  memoryTotal: string;
  diskFree: string | null;
  diskTotal: string | null;
  mediaFiles: number | null;
  mediaSize: string | null;
  loadAverage: string;
  systemUptime: string;
  appUptime: string;
  timezone: string;
  database: {
    version: string | null;
    size: string | null;
    events: number | null;
    posts: number | null;
    comments: number | null;
  };
  redis: {
    version: string | null;
    memory: string | null;
  };
  commitHash: string;
}

function formatBytes(bytes: number): string {
  const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const number = unit === 0 ? String(Math.round(value)) : value.toFixed(1);
  return `${number} ${units[unit]}`;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const parts = [
    days > 0 ? `${days} d` : null,
    hours > 0 ? `${hours} h` : null,
    minutes > 0 ? `${minutes} min` : null,
  ].filter((part): part is string => part !== null);
  if (parts.length === 0) {
    return `${Math.floor(seconds)} s`;
  }
  return parts.join(" ");
}

const EMPTY_DB_STATS = {
  version: null,
  size: null,
  events: null,
  posts: null,
  comments: null,
};

async function getDatabaseStats(): Promise<ServerInfo["database"]> {
  try {
    const result = await db.execute(
      sql`SELECT
        version() AS version,
        pg_size_pretty(pg_database_size(current_database())) AS size,
        (SELECT count(*) FROM event) AS events,
        (SELECT count(*) FROM post) AS posts,
        (SELECT count(*) FROM comment) AS comments`,
    );
    const row = result[0];
    return {
      version: (row?.version as string) ?? null,
      size: (row?.size as string) ?? null,
      events: (row?.events as number) ?? null,
      posts: (row?.posts as number) ?? null,
      comments: (row?.comments as number) ?? null,
    };
  } catch (e) {
    console.error("Could not determine database stats", e);
    return EMPTY_DB_STATS;
  }
}

async function getRedisStats(): Promise<ServerInfo["redis"]> {
  try {
    if (redis.status !== "ready") {
      return { version: null, memory: null };
    }
    const info = await redis.info();
    return {
      version: info.match(/redis_version:([^\r\n]+)/)?.[1] ?? null,
      memory: info.match(/used_memory_human:([^\r\n]+)/)?.[1] ?? null,
    };
  } catch (e) {
    console.error("Could not determine Redis stats", e);
    return { version: null, memory: null };
  }
}

async function getMediaStats(): Promise<{
  files: number | null;
  size: string | null;
}> {
  const dir = path.resolve(FILES_DIR);
  try {
    const files: string[] = [];
    const walk = async (current: string): Promise<void> => {
      for (const entry of await readdir(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else if (entry.isFile()) {
          files.push(full);
        }
      }
    };
    await walk(dir);
    let totalBytes = 0;
    for (const file of files) {
      const fileStat = await stat(file);
      totalBytes += fileStat.size;
    }
    return { files: files.length, size: formatBytes(totalBytes) };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return { files: 0, size: formatBytes(0) };
    }
    console.error(`Could not determine media size for ${dir}`, e);
    return { files: null, size: null };
  }
}

export const getServerInfo = async (): Promise<ServerInfo> => {
  const cpus = os.cpus();
  const commitHash = __COMMIT_HASH__;

  let diskFree: string | null = null;
  let diskTotal: string | null = null;
  try {
    const stats = await statfs(process.cwd());
    diskTotal = formatBytes(stats.bsize * stats.blocks);
    // bavail is the space available to unprivileged users (excludes the
    // root-only reserved blocks), i.e. what is actually free for the app.
    diskFree = formatBytes(stats.bsize * stats.bavail);
  } catch (e) {
    console.error(`Could not determine disk space for ${process.cwd()}`, e);
  }

  const [database, redisStats, media] = await Promise.all([
    getDatabaseStats(),
    getRedisStats(),
    getMediaStats(),
  ]);

  return {
    nodeVersion: process.version,
    platform: `${process.platform} / ${process.arch} / ${os.release()}`,
    hostname: os.hostname(),
    cpu: `${cpus.length} x ${cpus[0]?.model || "unknown"}`,
    memoryFree: formatBytes(os.freemem()),
    memoryTotal: formatBytes(os.totalmem()),
    diskFree,
    diskTotal,
    mediaFiles: media.files,
    mediaSize: media.size,
    loadAverage: os
      .loadavg()
      .map((value) => value.toFixed(2))
      .join(", "),
    systemUptime: formatUptime(os.uptime()),
    appUptime: formatUptime(process.uptime()),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    database,
    redis: redisStats,
    commitHash,
  };
};
