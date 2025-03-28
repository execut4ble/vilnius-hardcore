import type { EventsArray } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const load = (async (): Promise<{ events: EventsArray; recentPost }> => {
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
    ORDER  BY e.date ASC;`);

  const recentPost = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.user.username,
    })
    .from(table.post)
    .leftJoin(table.user, eq(table.user.id, table.post.author))
    .orderBy(desc(table.post.date))
    .limit(1);
  return { events, recentPost };
}) satisfies PageServerLoad;
