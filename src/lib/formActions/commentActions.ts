import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import { commentInsertSchema } from "$lib/server/db/validations";
import { z } from "zod";

const queryPostId = async (slug: string): Promise<number | undefined> => {
  const queryResult: table.Post | undefined = await db.query.post.findFirst({
    where: eq(table.post.slug, slug),
  });
  return queryResult?.id;
};

const queryEventId = async (slug: string): Promise<number | undefined> => {
  const queryResult: table.Event | undefined = await db.query.event.findFirst({
    where: eq(table.event.slug, slug),
  });
  return queryResult?.id;
};

export const commentActions = {
  add_comment: async ({ request, params, route, getClientAddress }) => {
    const parentRoute = route.id.split("/")[1];
    let postId: number | undefined;
    let eventId: number | undefined;
    const formData: FormData = await request.formData();
    switch (parentRoute) {
      case "blog": {
        postId = await queryPostId(params.slug);
        formData.append("postId", postId?.toString() as string);
        break;
      }
      case "events": {
        eventId = await queryEventId(params.slug);
        formData.append("eventId", eventId?.toString() as string);
        break;
      }
    }
    const ipAddress: string = getClientAddress();
    formData.append("ipAddress", ipAddress);
    const data: object = Object.fromEntries(formData.entries());
    try {
      const comment = commentInsertSchema.parse(data);
      await db.insert(table.comment).values(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = z.flattenError(err);
        return fail(400, { errors });
      } else {
        console.error(err);
        return error(500, "Something went wrong");
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
};
