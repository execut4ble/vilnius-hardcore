import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { postActions } from "$lib/formActions/postActions";

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

export const actions = postActions satisfies Actions;
