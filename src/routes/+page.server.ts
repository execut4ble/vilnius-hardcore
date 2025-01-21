import type { EventsArray } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

export const load = (async (): Promise<{ events: EventsArray }> => {
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
  return { events };
}) satisfies PageServerLoad;
