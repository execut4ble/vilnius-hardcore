import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import type { RecentComment, RecentCommentsData } from "$lib/types";
import { env } from "$env/dynamic/private";

const commentsEnabled = env.DISABLE_COMMENTS === "true" ? false : true;

const queryRecentComments = async ({ locals }) => {
  if (commentsEnabled) {
    const visibilityClause = locals.user
      ? sql``
      : sql`AND (c.event_id IS NULL OR e.is_visible = TRUE)`;

    try {
      const result = await db.execute(sql`
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

      return result.map((r) => r as RecentComment);
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return [];
  }
};

export const load: LayoutServerLoad = async ({ locals }) => {
  const recentComments: RecentCommentsData = await queryRecentComments({
    locals,
  });

  // Convert dates to ISO-8601 format (with timezone)
  for (const i in recentComments) {
    recentComments[i].date = new Date(recentComments[i].date).toISOString();
  }

  return {
    user: locals.user,
    recentComments,
    globalCommentsEnabled: env.DISABLE_COMMENTS === "true" ? false : true,
  };
};
