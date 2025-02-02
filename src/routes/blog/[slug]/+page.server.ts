import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error, fail } from "@sveltejs/kit";

export const load = (async ({ params }): Promise<{ post }> => {
  const post = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.user.username,
    })
    .from(table.post)
    .where(eq(table.post.slug, params.slug))
    .leftJoin(table.user, eq(table.user.id, table.post.author));

  if (post.length === 0) {
    error(404, "Not Found");
  }

  return { post };
}) satisfies PageServerLoad;

export const actions = {
  update_post: async ({ locals, params, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    await db
      .update(table.post)
      .set(data)
      .where(eq(table.post.slug, params.slug));
  },
  remove_post: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    await db.delete(table.post).where(eq(table.post.slug, slug as string));
  },
} satisfies Actions;
