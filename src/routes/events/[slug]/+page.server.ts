import type { EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";

export const load = (async ({ params }): Promise<{ event: EventsArray }> => {
  const event: EventsArray = await db
    .select()
    .from(table.event)
    .where(eq(table.event.slug, params.slug));
  return { event };
}) satisfies PageServerLoad;

export const actions = {
  update_event: async ({ params, request }): Promise<EventsArray> => {
    const formData: FormData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const event: EventsArray = await db
      .update(table.event)
      .set(data)
      .where(eq(table.event.slug, params.slug))
      .returning();
    return event;
  },
  remove_event: async ({ request }): Promise<{ events: EventsArray }> => {
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    const events: EventsArray = await db
      .delete(table.event)
      .where(eq(table.event.slug, slug as string));
    return { events };
  },
} satisfies Actions;
