import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const { sql } = locals;

    const events = await sql`select * from events where date >= CURRENT_DATE order by date asc`

    return {events};
}) satisfies PageServerLoad;