import type { EventsArray, PostsArray } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const load = (async (
  event,
): Promise<{ events: EventsArray; recentPost: PostsArray }> => {
  const visibilityClause = event.locals.user
    ? sql``
    : sql`AND is_visible = TRUE`;

  const events: EventsArray = await db.execute(sql`
    SELECT e.*,
       COALESCE(c.comments, 0) AS comments
    FROM   event e
       LEFT JOIN (SELECT event_id,
                         Count(*) AS comments
                  FROM   comment
                  GROUP  BY event_id) c
              ON e.id = c.event_id
    WHERE  e.date >= CURRENT_DATE
    ${visibilityClause}
    ORDER  BY e.date ASC;`);

  const recentPost = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.post.authorName,
      authorUsername: table.user.username,
      comments: sql<number>`COUNT(comment.id)`.as("comments"),
      disable_comments: table.post.disable_comments,
    })
    .from(table.post)
    .leftJoin(table.user, eq(table.user.id, table.post.author))
    .leftJoin(table.comment, eq(table.comment.postId, table.post.id))
    .groupBy(
      table.post.id,
      table.user.username,
      table.post.title,
      table.post.date,
      table.post.body,
      table.post.slug,
      table.post.image,
      table.post.authorName,
    )
    .orderBy(desc(table.post.date))
    .limit(1);

  // Convert dates to ISO-8601 format
  for (const i in events) {
    events[i].date = new Date(events[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { events, recentPost };
}) satisfies PageServerLoad;
