import { json } from "@sveltejs/kit";
import { getCachedRecordings, refreshCache } from "$lib/server/recordings";

export async function GET() {
  let cached = await getCachedRecordings();

  // Force cache refresh
  if (!cached) {
    await refreshCache({ force: true });
    cached = await getCachedRecordings();
  }

  // If no cached data, return 503
  if (!cached) {
    return json({ error: "No data available yet" }, { status: 503 });
  }

  function parseYYYYMMDD(input: string | number | null): Date {
    const str = String(input);
    const year = parseInt(str.slice(0, 4), 10);
    const month = parseInt(str.slice(4, 6), 10) - 1; // JS months are 0-indexed
    const day = parseInt(str.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  return json({
    date: parseYYYYMMDD(cached.date),
    recordings: cached.recordings,
    cachedAt: new Date(cached.fetchedAt).toISOString(),
  });
}
