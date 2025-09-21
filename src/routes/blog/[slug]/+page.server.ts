import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { asc, eq, isNotNull } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { postActions } from "$lib/formActions/postActions";
import { commentActions } from "$lib/formActions/commentActions";
import type { PostsArray } from "$lib/types";

export const load = (async ({
  locals,
  params,
}): Promise<{
  post: PostsArray;
  comments: Array<Omit<table.Comment, "postId" | "eventId">>;
}> => {
  const post = await db
    .select({
      id: table.post.id,
      title: table.post.title,
      date: table.post.date,
      body: table.post.body,
      slug: table.post.slug,
      image: table.post.image,
      authorName: table.post.authorName,
      authorUsername: table.user.username,
    })
    .from(table.post)
    .where(eq(table.post.slug, params.slug))
    .leftJoin(table.user, eq(table.user.id, table.post.author));

  if (post.length === 0) {
    error(404, "Not Found");
  }

  // TODO: Refactor this instance and events/[slug]/+page.server.ts instance
  // into a shared database helper method for loading comments
  if (!locals.user) {
    const comments = await db
      .select({
        id: table.comment.id,
        author: table.comment.author,
        content: table.comment.content,
        date: table.comment.date,
        ipAddress: table.comment.ipAddress,
      })
      .from(table.comment)
      .innerJoin(table.post, eq(table.comment.postId, table.post.id))
      .where(eq(table.post.slug, params.slug))
      .orderBy(asc(table.comment.date));
    return { post, comments };
  } else {
    const comments = await db
      .select({
        id: table.comment.id,
        author: table.comment.author,
        content: table.comment.content,
        date: table.comment.date,
        ipAddress: table.comment.ipAddress,
        isIpBanned: isNotNull(table.bannedIp.ipAddress),
      })
      .from(table.comment)
      .innerJoin(table.post, eq(table.comment.postId, table.post.id))
      .leftJoin(
        table.bannedIp,
        eq(table.comment.ipAddress, table.bannedIp.ipAddress),
      )
      .where(eq(table.post.slug, params.slug))
      .orderBy(asc(table.comment.date));
    return { post, comments };
  }
}) satisfies PageServerLoad;

export const actions = {
  ...postActions,
  ...commentActions,
} satisfies Actions;
