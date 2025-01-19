import type { CommentsArray, EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { uploadImageAction } from "$lib/files-dir";
import { error, fail } from "@sveltejs/kit";

export const load = (async ({
  params,
}): Promise<{ event: EventsArray; comments: CommentsArray }> => {
  const event: EventsArray = await db
    .select()
    .from(table.event)
    .where(eq(table.event.slug, params.slug));

  if (event.length === 0) {
    error(404, "Not Found");
  }

  const comments = await db
    .select({
      id: table.comment.id,
      author: table.comment.author,
      content: table.comment.content,
      date: table.comment.date,
    })
    .from(table.comment)
    .innerJoin(table.event, eq(table.comment.eventId, table.event.id))
    .where(eq(table.event.slug, params.slug));
  return { event, comments };
}) satisfies PageServerLoad;

export const actions = {
  update_event: async ({ locals, params, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    await db
      .update(table.event)
      .set(data)
      .where(eq(table.event.slug, params.slug));
  },
  remove_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    await db.delete(table.event).where(eq(table.event.slug, slug as string));
  },
  upload_image: uploadImageAction,
  add_comment: async ({ request, params }) => {
    const eventId = await db
      .select({ id: table.event.id })
      .from(table.event)
      .where(eq(table.event.slug, params.slug));
    const date: Date = new Date();
    const formData: FormData = await request.formData();
    formData.set("date", date.toISOString());
    formData.set("eventId", eventId[0].id.toString());
    const data: Object = Object.fromEntries(formData.entries());

    await db.insert(table.comment).values(data as any);
  },
} satisfies Actions;
