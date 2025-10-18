import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { asc, DrizzleQueryError } from "drizzle-orm";
import z from "zod";
import {
  generateUserId,
  passwordSchema,
  usernameSchema,
} from "$lib/server/user";
import { hash } from "@node-rs/argon2";

export const load = (async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/crew/login");
  } else {
    const users = await db
      .select({
        id: table.user.id,
        username: table.user.username,
      })
      .from(table.user)
      .orderBy(asc(table.user.username));

    return { users };
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!event.locals.session) {
      return fail(401);
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return fail(400, { message: "Invalid form data" });
    }

    try {
      usernameSchema.parse(username);
      passwordSchema.parse(password);

      const userId = generateUserId();
      const passwordHash = await hash(password as string, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      await db
        .insert(table.user)
        .values({ id: userId, username, passwordHash });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { errors } = z.treeifyError(err);
        return fail(400, { message: errors });
      } else if (err instanceof DrizzleQueryError) {
        if (
          err.cause?.message.includes(
            "duplicate key value violates unique constraint",
          )
        ) {
          return fail(400, { message: "Username already taken" });
        }
      } else {
        console.error(err);
        return fail(500, { message: "An error has occurred" });
      }
    }

    return {
      success: true,
      message: "Successfully registered " + username + "!",
    };
  },
};
