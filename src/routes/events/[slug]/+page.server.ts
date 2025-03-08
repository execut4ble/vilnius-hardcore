import type { CommentsArray, EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { uploadImageAction } from "$lib/files-dir";
import { error, fail } from "@sveltejs/kit";
import * as z from "zod";
import validator from "validator";

const commentSchema = z.object({
  author: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must be less than 30 characters" })
    .trim()
    .refine((value) => !validator.isEmpty(value), {
      message: "Name can't be empty",
    }),
  content: z
    .string({ required_error: "Comment can't be empty" })
    .min(1, { message: "Comment can't be empty" })
    .max(250, { message: "Comment must be less than 250 characters" })
    .trim()
    .refine((value) => !validator.isEmpty(value), {
      message: "Comment can't be empty",
    }),
  date: z.coerce.date(),
  eventId: z.string().trim(),
});

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
    const event = await db
      .update(table.event)
      .set(data)
      .where(eq(table.event.slug, params.slug))
      .returning();
    return event;
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
    try {
      const comment = commentSchema.parse(data);
      await db.insert(table.comment).values(comment as any);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = err.flatten();
        return fail(400, { errors });
      }
    }
  },

  remove_comment: async ({ request, locals }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const commentId: FormDataEntryValue | null = formData.get("id");
    await db
      .delete(table.comment)
      .where(eq(table.comment.id, commentId as any));
  },
} satisfies Actions;
