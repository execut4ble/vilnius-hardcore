import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { postActions } from "$lib/formActions/postActions";

export const load = (async ({ url }): Promise<{ posts; meta }> => {
  const limit = Number(url.searchParams.get("limit")) || 5;
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
  const meta = await db.select({ totalPosts: count() }).from(table.post);
  return { posts, meta };
}) satisfies PageServerLoad;

export const actions = postActions satisfies Actions;
