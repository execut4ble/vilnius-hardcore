import { db } from "#lib/server/db/index.js";
import * as table from "#lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import {
  postInsertSchema,
  postUpdateSchema,
} from "#lib/server/db/validations.js";
import { z } from "zod";

export const postActions = {
  update_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    const slug: FormDataEntryValue | null = formData.get("slug");
    try {
      const parsed = postUpdateSchema.parse(data);
      const response = await db
        .update(table.post)
        .set(parsed)
        .where(eq(table.post.slug, slug as string))
        .returning();
      return response;
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
  create_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    try {
      const parsed = postInsertSchema.parse(data);
      await db.insert(table.post).values({
        title: parsed.title,
        body: parsed.body,
        disable_comments: parsed.disable_comments,
        author: locals.user?.id,
      });
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
  remove_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    await db.delete(table.post).where(eq(table.post.slug, slug as string));
  },
};
