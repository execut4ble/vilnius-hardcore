import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ params, locals }) => {
    const { sql } = locals;

    const event = await sql`select * from events where slug = ${params.slug}`
    return {event};
}) satisfies PageServerLoad;

export const actions = {
    update_title: async({ params, locals, request }) => {
    const { sql } = locals;
    const data = await request.formData();
    const slug = await sql`update events set title = ${data.get('title')} where slug = ${params.slug} returning slug`
    return slug
}} satisfies Actions