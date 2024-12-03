import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ params, locals }) => {
    const { sql } = locals;

    const event = await sql`select * from events where slug = ${params.slug}`
    return {event};
}) satisfies PageServerLoad;

export const actions = {
    update_event: async({ params, locals, request }) => {
    const { sql } = locals;
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const columns = Object.keys(data);
    const event = await sql`update events set ${sql(data, columns)} where slug = ${params.slug} returning events.*`
    return event
},
} satisfies Actions