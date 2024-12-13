import type { EventsArray } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { sql } from "drizzle-orm";

export const load = (async (): Promise<{ events: EventsArray }> => {
  const events: EventsArray = await db.execute(
    sql`select * from event where date >= CURRENT_DATE order by date asc`,
  );

  return { events };
}) satisfies PageServerLoad;
