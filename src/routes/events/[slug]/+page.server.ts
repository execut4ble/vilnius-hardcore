import type { EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { asc, eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eventActions } from "$lib/formActions/eventActions";
import { commentActions } from "$lib/formActions/commentActions";

export const load = (async ({
  params,
  locals,
}): Promise<{
  event: EventsArray;
  comments: Array<Omit<table.Comment, "eventId" | "postId">>;
}> => {
  const event: EventsArray = await db
    .select()
    .from(table.event)
    .where(eq(table.event.slug, params.slug));

  if (event.length === 0 || (!locals.user && !event[0]?.is_visible)) {
    error(404, "Not Found");
  }

  const comments = await db
    .select({
      id: table.comment.id,
      author: table.comment.author,
      content: table.comment.content,
      date: table.comment.date,
      ipAddress: table.comment.ipAddress,
    })
    .from(table.comment)
    .innerJoin(table.event, eq(table.comment.eventId, table.event.id))
    .where(eq(table.event.slug, params.slug))
    .orderBy(asc(table.comment.date));

  // Convert date to ISO-8601 string
  for (const i in event) {
    event[i].date = new Date(event[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  return { event, comments };
}) satisfies PageServerLoad;

export const actions = {
  ...eventActions,
  ...commentActions,
} satisfies Actions;
