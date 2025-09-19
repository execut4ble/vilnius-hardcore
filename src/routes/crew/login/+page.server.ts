import { verify } from "@node-rs/argon2";
import { fail, redirect } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
import { hash } from "@node-rs/argon2";
import {
  generateUserId,
  passwordSchema,
  usernameSchema,
  validatePassword,
  validateUsername,
} from "$lib/server/user";
import { z } from "zod";

export const load: PageServerLoad = async (event) => {
  if ((await getUserCount()) === 0) {
    return { registrationAllowed: true };
  }
  if (event.locals.user) {
    return redirect(302, "/crew");
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (!validateUsername(username)) {
      return fail(400, { message: "Invalid username" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Invalid password" });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return fail(400, { message: "Incorrect username or password" });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, "/crew");
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      return fail(400, { message: "Invalid form data" });
    }

    if ((await getUserCount()) > 0) {
      return fail(403, { message: "A user already exists" });
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
      } else {
        console.error(err);
        return fail(500, { message: "An error has occurred" });
      }
    }
    return redirect(302, "/crew");
  },
};

async function getUserCount() {
  const userCount: Array<{ count: number }> = await db
    .select({ count: count() })
    .from(table.user);
  return userCount[0].count;
}
