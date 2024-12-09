import type { EventArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";

export const load = (async ({ locals }): Promise<{ events: EventArray }> => {
  const { sql } = locals;

  const events: EventArray = await sql`select * from events order by date asc`;

  return { events };
}) satisfies PageServerLoad;

export const actions = {
  update_event: async ({ locals, request }): Promise<EventArray> => {
    const { sql } = locals;
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const columns = Object.keys(data);
    const event =
      await sql`update events set ${sql(data, columns)} where slug = ${formData.get("slug")} returning events.*`;
    return event;
  },
  create_event: async ({
    locals,
    request,
  }): Promise<{ events: EventArray }> => {
    const { sql } = locals;
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const columns = Object.keys(data);
    const events: EventArray =
      await sql`insert into events ${sql(data, columns)} returning events.*`;
    return { events };
  },
  remove_event: async ({
    locals,
    request,
  }): Promise<{ events: EventArray }> => {
    const { sql } = locals;
    const formData = await request.formData();
    const events: EventArray =
      await sql`delete from events where slug = ${formData.get("slug")}`;
    return { events };
  },
} satisfies Actions;
