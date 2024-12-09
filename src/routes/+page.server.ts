import type { EventArray } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }): Promise<{ events: EventArray }> => {
  const { sql } = locals;

  const events: EventArray =
    await sql`select * from events where date >= CURRENT_DATE order by date asc`;

  return { events };
}) satisfies PageServerLoad;
