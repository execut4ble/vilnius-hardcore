import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import type { RecentCommentsData } from "$lib/types";
import { toISOStringWithTimezone } from "$lib/dateFormat";

export const load: LayoutServerLoad = async (event) => {
  let recentComments: RecentCommentsData = await db.execute(sql`
    SELECT 
      c.id AS id,
      c.author AS author,
      c.date AS date,
      e.title AS event_name,
      e.slug AS event_slug
    FROM comment c
    JOIN event e ON c.event_id = e.id
    ORDER BY c.date DESC
    LIMIT 5;`);

  // Convert date to ISO-8601 format
  for (let i in recentComments) {
    recentComments[i].date = toISOStringWithTimezone(
      new Date(recentComments[i].date),
    );
  }

  return { user: event.locals.user, recentComments };
};
