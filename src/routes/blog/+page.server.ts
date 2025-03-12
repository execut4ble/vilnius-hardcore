import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { postInsertSchema } from "$lib/server/db/validations";
import { z } from "zod";

export const load = (async ({ url }): Promise<{ posts; meta }> => {
  let limit = Number(url.searchParams.get("limit")) || 5;
  const posts = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.user.username, // Selecting author's username
    })
    .from(table.post)
    .leftJoin(table.user, eq(table.user.id, table.post.author))
    .orderBy(desc(table.post.date))
    .limit(limit);
  let meta = await db.select({ totalPosts: count() }).from(table.post);
  return { posts, meta };
}) satisfies PageServerLoad;

export const actions = {
  update_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: Object = Object.fromEntries(formData.entries());
    const slug: FormDataEntryValue | null = formData.get("slug");
    await db
      .update(table.post)
      .set(data)
      .where(eq(table.post.slug, slug as string));
  },
  create_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const userId = locals.user?.id;
    formData.append("author", userId as string);
    const data: Object = Object.fromEntries(formData.entries());
    try {
      const post = postInsertSchema.parse(data);
      await db.insert(table.post).values(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = err.flatten();
        return fail(400, { errors });
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
