import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
    const { sql } = locals;

    const event = await sql`select * from events where slug = ${params.slug}`
    return {event};
}) satisfies PageServerLoad;