import type { Actions, PageServerLoad } from "./$types";
import { db } from "#lib/server/db/index.js";
import { eq } from "drizzle-orm";
import * as table from "#lib/server/db/schema.js";
import { error } from "@sveltejs/kit";
import { postActions } from "#lib/server/actions/post.actions.js";
import { commentActions } from "#lib/server/actions/comment.actions.js";
import type { PostsArray } from "#lib/types.js";
import { loadPostComments } from "#lib/server/db/queries/comments.js";
import { DISABLE_COMMENTS } from "$app/env/private";

const commentsEnabled = DISABLE_COMMENTS === "true" ? false : true;

export const load = (async ({
  locals,
  params,
}): Promise<{
  post: PostsArray;
  comments?: Array<Omit<table.Comment, "postId" | "eventId">>;
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
      disable_comments: table.post.disable_comments,
    })
    .from(table.post)
    .where(eq(table.post.slug, params.slug))
    .leftJoin(table.user, eq(table.user.id, table.post.author));

  if (post.length === 0) {
    error(404, "Not Found");
  }

  if (commentsEnabled) {
    const comments = await loadPostComments(locals, params);
    return { post, comments };
  } else {
    return { post };
  }
}) satisfies PageServerLoad;

export const actions = {
  ...postActions,
  ...commentActions,
} satisfies Actions;
