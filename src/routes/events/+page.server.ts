import type { EventsArray } from "#lib/types.js";
import { and, count, eq, gte, sql } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "#lib/server/db/index.js";
import * as table from "#lib/server/db/schema.js";
import { eventActions } from "#lib/server/actions/event.actions.js";
import { DISABLE_COMMENTS } from "$app/env/private";
import { loadUpcomingEvents } from "#lib/server/db/queries/events.js";

const commentsEnabled = DISABLE_COMMENTS !== "true";

export const load = (async ({
  locals,
  url,
}): Promise<{ events: EventsArray; meta: { totalEvents: number }[] }> => {
  const limit = Number(url.searchParams.get("limit")) || 5;

  const events = await loadUpcomingEvents(locals, limit, commentsEnabled);

  const visibilityCondition = locals.user
    ? undefined
    : eq(table.event.is_visible, true);

  const meta = await db
    .select({ totalEvents: count() })
    .from(table.event)
    .where(and(gte(table.event.date, sql`CURRENT_DATE`), visibilityCondition));

  // Convert dates to ISO-8601 format
  for (const i in events) {
    events[i].date = new Date(events[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { events, meta };
}) satisfies PageServerLoad;

export const actions = eventActions satisfies Actions;
