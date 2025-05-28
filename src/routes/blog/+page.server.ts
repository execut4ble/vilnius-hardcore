import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count, sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { postActions } from "$lib/formActions/postActions";
import type { PostsArray } from "$lib/types";

export const load = (async ({ url }): Promise<{ posts: PostsArray; meta: { totalPosts: number }[] }> => {
  const limit = Number(url.searchParams.get("limit")) || 5;
  const posts = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.post.authorName,
      authorUsername: table.user.username,
      comments: sql<number>`COUNT(comment.id)`.as("comments"),
    })
    .from(table.post)
    .leftJoin(table.user, eq(table.user.id, table.post.author))
    .leftJoin(table.comment, eq(table.comment.postId, table.post.id))
    .groupBy(
      table.post.id,
      table.post.title,
      table.post.date,
      table.post.body,
      table.post.slug,
      table.post.image,
      table.user.username,
      table.post.authorName,
    )
    .orderBy(desc(table.post.date))
    .limit(limit);
  const meta = await db.select({ totalPosts: count() }).from(table.post);

  return { posts, meta };
}) satisfies PageServerLoad;

export const actions = postActions satisfies Actions;
