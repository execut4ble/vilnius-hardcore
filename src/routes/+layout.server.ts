import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import type { RecentCommentsData } from "$lib/types";

export const load: LayoutServerLoad = async (event) => {
  const visibilityClause = event.locals.user
    ? sql``
    : sql`WHERE e.is_visible = TRUE`;

  const recentComments: RecentCommentsData = await db.execute(sql`
    SELECT 
      c.id AS id,
      c.author AS author,
      c.date AS date,
      e.title AS event_name,
      e.slug AS event_slug
    FROM comment c
    JOIN event e ON c.event_id = e.id
    ${visibilityClause}
    ORDER BY c.date DESC
    LIMIT 5;`);

  // Convert dates to ISO-8601 format (with timezone)
  for (const i in recentComments) {
    recentComments[i].date = new Date(recentComments[i].date).toISOString();
  }

  return { user: event.locals.user, recentComments };
};
