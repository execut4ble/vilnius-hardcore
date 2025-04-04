import type { EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { asc, eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error, fail } from "@sveltejs/kit";
import * as z from "zod";
import { commentInsertSchema } from "$lib/server/db/validations";
import { eventActions } from "$lib/formActions/eventActions";

export const load = (async ({
  params,
}): Promise<{
  event: EventsArray;
  comments: Array<Omit<table.Comment, "eventId">>;
}> => {
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
    .where(eq(table.event.slug, params.slug))
    .orderBy(asc(table.comment.date));

  // Convert date to ISO-8601 string
  for (let i in event) {
    event[i].date = new Date(event[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { event, comments };
}) satisfies PageServerLoad;

const queryEventId = async (slug: string): Promise<number | undefined> => {
  const queryResult: table.Event | undefined = await db.query.event.findFirst({
    where: eq(table.event.slug, slug),
  });
  return queryResult?.id;
};

export const actions = {
  ...eventActions,
  add_comment: async ({ request, params }) => {
    const eventId: number | undefined = await queryEventId(params.slug);
    const formData: FormData = await request.formData();
    formData.append("eventId", eventId?.toString() as string);
    const data: object = Object.fromEntries(formData.entries());
    try {
      const comment = commentInsertSchema.parse(data);
      await db.insert(table.comment).values(comment);
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
      .where(eq(table.comment.id, commentId as unknown as number));
  },
} satisfies Actions;
