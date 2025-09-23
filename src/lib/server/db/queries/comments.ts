import * as table from "$lib/server/db/schema";
import { asc, eq, isNotNull } from "drizzle-orm";
import { db } from "$lib/server/db";
import type { CommentsArray } from "$lib/types";

const loadComments = async (locals, params, parentTable, parentId) => {
  return db
    .select({
      id: table.comment.id,
      author: table.comment.author,
      content: table.comment.content,
      date: table.comment.date,
      ipAddress: table.comment.ipAddress,
      ...(locals.user && {
        isIpBanned: isNotNull(table.bannedIp.ipAddress),
      }),
    })
    .from(table.comment)
    .innerJoin(parentTable, eq(parentId, parentTable.id))
    .leftJoin(
      table.bannedIp,
      eq(table.comment.ipAddress, table.bannedIp.ipAddress),
    )
    .where(eq(parentTable.slug, params.slug))
    .orderBy(asc(table.comment.date));
};

export const loadPostComments = async (locals, params) => {
  return (await loadComments(
    locals,
    params,
    table.post,
    table.comment.postId,
  )) as unknown as CommentsArray;
};

export const loadEventComments = async (locals, params) => {
  return (await loadComments(
    locals,
    params,
    table.event,
    table.comment.eventId,
  )) as unknown as CommentsArray;
};
