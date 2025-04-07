import type { EventsArray } from "$lib/types";
import { count, sql } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eventActions } from "$lib/formActions/eventActions";

export const load = (async ({
  locals,
  url,
}): Promise<{ events: EventsArray; meta }> => {
  const visibilityClause = locals.user ? sql`` : sql`AND is_visible = TRUE`;

  const limit = Number(url.searchParams.get("limit")) || 5;
  const events: EventsArray = await db.execute(sql`
    SELECT e.*,
       Coalesce(c.comments, 0) AS comments
    FROM   (SELECT *
        FROM   event
        WHERE  date >= CURRENT_DATE -- All upcoming events including today
        ${visibilityClause}
        UNION ALL
        SELECT *
        FROM   (SELECT *
                FROM   event
                WHERE  date < CURRENT_DATE -- Past events before today
                ${visibilityClause}
                ORDER  BY date DESC
                LIMIT  ${limit}) past_events) e
       LEFT JOIN (SELECT event_id,
                         Count(*) AS comments
                  FROM   comment
                  GROUP  BY event_id) c
              ON e.id = c.event_id
  ORDER  BY e.date;`);
  const meta = await db.select({ totalEvents: count() }).from(table.event);

  // Convert dates to ISO-8601 format
  for (let i in events) {
    events[i].date = new Date(events[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { events, meta };
}) satisfies PageServerLoad;

export const actions = eventActions satisfies Actions;
