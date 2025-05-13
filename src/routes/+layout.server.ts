import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";
import type { RecentCommentsData } from "$lib/types";
import { asc } from "drizzle-orm";

export const load: LayoutServerLoad = async (event) => {
  const visibilityClause = event.locals.user
    ? sql``
    : sql`AND (c.event_id IS NULL OR e.is_visible = TRUE)`;

  const recentComments: RecentCommentsData = await db.execute(sql`
  SELECT 
    c.id AS id,
    c.author AS author,
    c.date AS date,
    e.title AS event_name,
    e.slug AS event_slug,
    p.title AS post_title,
    p.slug AS post_slug
  FROM comment c
  LEFT JOIN event e ON c.event_id = e.id
  LEFT JOIN post p ON c.post_id = p.id
  WHERE 1=1
  ${visibilityClause}
  ORDER BY c.date DESC
  LIMIT 5;`);

  const shouts = await db
    .select()
    .from(table.shout)
    .orderBy(asc(table.shout.date));

  // Convert dates to ISO-8601 format (with timezone)
  for (const i in recentComments) {
    recentComments[i].date = new Date(recentComments[i].date).toISOString();
  }

  return { user: event.locals.user, recentComments, shouts };
};
