import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { count, sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { postActions } from "$lib/formActions/postActions";
import type { PostsArray } from "$lib/types";
import { DISABLE_COMMENTS } from "$env/static/private";

const commentsEnabled = DISABLE_COMMENTS === "false" ? true : false;

export const load = (async ({
  url,
}): Promise<{ posts: PostsArray; meta: { totalPosts: number }[] }> => {
  const limit = Number(url.searchParams.get("limit")) || 5;

  const columns = {
    commentsEnabled: {
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.post.authorName,
      authorUsername: table.user.username,
      disable_comments: table.post.disable_comments,
      comments: sql<number>`COUNT(${table.comment.id})`.as("comments"),
    },
    commentsDisabled: {
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.post.authorName,
      authorUsername: table.user.username,
    },
  } as const;

  const query = db
    .select(
      commentsEnabled ? columns.commentsEnabled : columns.commentsDisabled,
    )
    .from(table.post)
    .leftJoin(table.user, eq(table.user.id, table.post.author))
    .$dynamic();

  if (commentsEnabled) {
    query.leftJoin(table.comment, eq(table.comment.postId, table.post.id));
  }

  const posts = await query
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
