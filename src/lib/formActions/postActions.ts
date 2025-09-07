import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import { postInsertSchema, postUpdateSchema } from "$lib/server/db/validations";
import { z } from "zod/v4";

export const postActions = {
  update_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    const slug: FormDataEntryValue | null = formData.get("slug");
    try {
      const post = postUpdateSchema.parse(data);
      const response = await db
        .update(table.post)
        .set(post)
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
    const userId = locals.user?.id;
    formData.append("author", userId as string);
    const data: object = Object.fromEntries(formData.entries());
    try {
      const post = postInsertSchema.parse(data);
      await db.insert(table.post).values(post);
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
