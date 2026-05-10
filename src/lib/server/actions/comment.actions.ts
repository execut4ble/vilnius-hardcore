import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { error, fail } from "@sveltejs/kit";
import {
  banInsertSchema,
  commentInsertSchema,
} from "$lib/server/db/validations";
import { z } from "zod";
import { env } from "$env/dynamic/private";

const commentsEnabled = env.DISABLE_COMMENTS === "true" ? false : true;

const queryPostId = async (slug: string): Promise<number | undefined> => {
  const queryResult: table.Post | undefined = await db.query.post.findFirst({
    where: eq(table.post.slug, slug),
  });
  if (queryResult?.disable_comments) {
    return -403;
  }
  if (queryResult === undefined) {
    return -1;
  }
  return queryResult?.id;
};

const queryEventId = async (slug: string): Promise<number | undefined> => {
  const queryResult: table.Event | undefined = await db.query.event.findFirst({
    where: eq(table.event.slug, slug),
  });
  if (queryResult?.disable_comments) {
    return -403;
  }
  if (queryResult === undefined) {
    return -1;
  }
  return queryResult?.id;
};

export const commentActions = {
  add_comment: async ({ request, locals, params, route, getClientAddress }) => {
    const parentRoute = route.id.split("/")[1];
    const formData: FormData = await request.formData();

    // Resolve the parent entity (blog post or event) and append its ID to the form data
    let postId: number | undefined;
    let eventId: number | undefined;

    switch (parentRoute) {
      case "blog": {
        postId = await queryPostId(params.slug);
        if (postId === -403 || !commentsEnabled) {
          return fail(403, { errors: { submit: ["Comments are disabled"] } });
        } else if (postId === -1) {
          return fail(404, {
            errors: { submit: ["Post not found. Refresh the page."] },
          });
        }
        formData.append("postId", postId?.toString() as string);
        break;
      }
      case "events": {
        eventId = await queryEventId(params.slug);
        if (eventId === -403 || !commentsEnabled) {
          return fail(403, { errors: { submit: ["Comments are disabled"] } });
        } else if (eventId === -1) {
          return fail(404, {
            errors: { submit: ["Event not found. Refresh the page."] },
          });
        }
        formData.append("eventId", eventId?.toString() as string);
        break;
      }
    }

    if (!locals.session && formData.get("authorIsCrew") === "on") {
      return fail(401);
    }

    // Append acab flag to the form data if user is logged in
    if (locals.session) formData.append("acab", "1312");

    // Append the client's IP address and parse the form data into a flat object
    const ipAddress = getClientAddress();
    formData.append("ipAddress", ipAddress);
    const data = Object.fromEntries(formData.entries());

    if (!locals.session && data.authorIsCrew === "on") {
      return fail(401);
    }

    try {
      const comment = commentInsertSchema.parse(data);

      // Reject the comment if the IP is banned
      const [bannedEntry] = await db
        .select()
        .from(table.bannedIp)
        .where(eq(table.bannedIp.ipAddress, ipAddress));

      if (bannedEntry) {
        return fail(403, { errors: { submit: ["Something went wrong"] } });
      }

      // Insert the comment into the database
      await db.insert(table.comment).values(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = z.flattenError(err);
        return fail(400, { errors });
      }
      console.error(err);
      return error(500, "Something went wrong");
    }
  },

  remove_comment: async ({ request, locals }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const commentId: FormDataEntryValue | null = formData.get("id");
    await db
      .delete(table.comment)
      .where(eq(table.comment.id, commentId as unknown as number));
  },

  add_banned_ip: async ({ request, locals }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    try {
      const ban = banInsertSchema.parse(data);
      await db.insert(table.bannedIp).values(ban);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = z.flattenError(err);
        return fail(400, { errors });
      } else {
        console.error(err);
        return error(500, "Something went wrong");
      }
    }
  },
};
