import type { EventsArray } from "$lib/types";
import { count, eq, lt, and, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { env } from "$env/dynamic/private";
import { loadArchivedEvents } from "$lib/server/db/queries/events";
import { eventActions } from "$lib/server/actions/event.actions";

const commentsEnabled = env.DISABLE_COMMENTS !== "true";

export const load = (async ({
  locals,
  url,
}): Promise<{ events: EventsArray; meta: { totalEvents: number }[] }> => {
  const limit = Number(url.searchParams.get("limit")) || 5;

  const events = await loadArchivedEvents(locals, limit, commentsEnabled);

  const visibilityCondition = locals.user
    ? undefined
    : eq(table.event.is_visible, true);

  const meta = await db
    .select({ totalEvents: count() })
    .from(table.event)
    .where(and(lt(table.event.date, sql`CURRENT_DATE`), visibilityCondition));

  // Convert dates to ISO-8601 format
  for (const i in events) {
    events[i].date = new Date(events[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { events, meta };
}) satisfies PageServerLoad;

export const actions = eventActions satisfies Actions;
