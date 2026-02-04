import type { EventsArray } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eventActions } from "$lib/server/actions/event.actions";
import { commentActions } from "$lib/server/actions/comment.actions";
import { loadEventComments } from "$lib/server/db/queries/comments";
import { env } from "$env/dynamic/private";

const commentsEnabled = env.DISABLE_COMMENTS === "true" ? false : true;

export const load = (async ({
  params,
  locals,
}): Promise<{
  event: EventsArray;
  comments?: Array<Omit<table.Comment, "eventId" | "postId">>;
}> => {
  const event: EventsArray = await db
    .select()
    .from(table.event)
    .where(eq(table.event.slug, params.slug));

  if (event.length === 0 || (!locals.user && !event[0]?.is_visible)) {
    error(404, "Not Found");
  }

  // Convert date to ISO-8601 string
  for (const i in event) {
    event[i].date = new Date(event[i].date)
      .toLocaleString("lt")
      .replace(" ", "T");
  }

  if (commentsEnabled) {
    const comments = await loadEventComments(locals, params);
    return { event, comments };
  } else {
    return { event };
  }
}) satisfies PageServerLoad;

export const actions = {
  ...eventActions,
  ...commentActions,
} satisfies Actions;
