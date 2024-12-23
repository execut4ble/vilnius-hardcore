import type { EventsArray } from "$lib/types";
import { count, sql } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { uploadImageAction } from "$lib/files-dir";
import { fail } from "@sveltejs/kit";

export const load = (async ({
  url,
}): Promise<{ events: EventsArray; meta }> => {
  let limit = Number(url.searchParams.get("limit")) || 5;
  let events: EventsArray = await db.execute(sql`SELECT *
    FROM event
    WHERE date >= CURRENT_DATE -- All upcoming events including today
    UNION ALL
    SELECT *
    FROM (
        SELECT *
        FROM event
        WHERE date < CURRENT_DATE -- Past events before today
        ORDER BY date DESC
        LIMIT ${limit}
    ) past_events
    ORDER BY date;`);
  let meta = await db.select({ totalEvents: count() }).from(table.event);
  return { events, meta };
}) satisfies PageServerLoad;

export const actions = {
  update_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
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
  create_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: Object = Object.fromEntries(formData.entries());
    const events: EventsArray = await db
      .insert(table.event)
      .values(data as any)
      .returning();
    return { events };
  },
  remove_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    const events: EventsArray = await db
      .delete(table.event)
      .where(eq(table.event.slug, slug as string));
    return { events };
  },
  upload_image: uploadImageAction,
} satisfies Actions;
