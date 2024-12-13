import type { EventsArray, EventObject } from "$lib/types";
import { asc } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";

export const load = (async (): Promise<{ events: EventsArray }> => {
  const events: EventsArray = await db
    .select()
    .from(table.event)
    .orderBy(asc(table.event.date));
  return { events };
}) satisfies PageServerLoad;

export const actions = {
  update_event: async ({ request }): Promise<EventsArray> => {
    const formData: FormData = await request.formData();
    const data: Object = Object.fromEntries(formData.entries());
    const slug: FormDataEntryValue | null = formData.get("slug");
    const event = await db
      .update(table.event)
      .set(data)
      .where(eq(table.event.slug, slug as string))
      .returning();
    return event;
  },
  create_event: async ({ request }): Promise<{ events: EventsArray }> => {
    const formData: FormData = await request.formData();
    const data: Object = Object.fromEntries(formData.entries());
    const events: EventsArray = await db
      .insert(table.event)
      .values(data as any)
      .returning();
    return { events };
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
