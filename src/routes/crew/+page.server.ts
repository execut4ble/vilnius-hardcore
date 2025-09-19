import { verify } from "@node-rs/argon2";
import { hash } from "@node-rs/argon2";
import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import {
  generateUserId,
  passwordSchema,
  usernameSchema,
} from "$lib/server/user";
import { z } from "zod";
import { DrizzleQueryError } from "drizzle-orm/errors";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, "/crew/login");
  }
  return { user: event.locals.user };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, "/crew/login");
  },
  change_password: async (event) => {
    if (!event.locals.session) {
      return fail(401, { message: "Not logged in" });
    }

    const formData = await event.request.formData();
    const currentPassword = formData.get("password");
    const newPassword = formData.get("newPass");
    const newPasswordRepeat = formData.get("newPassRepeat");

    if (event.locals.user === null) {
      return fail(403, { msg: "Not logged in" });
    }

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof newPasswordRepeat !== "string"
    ) {
      return fail(400, { msg: "Invalid form data" });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, event.locals.user?.username as string));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: "User not found" });
    }
    const validPassword = await verify(
      existingUser.passwordHash,
      currentPassword as string,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      },
    );
    if (!validPassword) {
      return fail(400, { message: "Current password is invalid" });
    }

    if (newPasswordRepeat !== newPassword) {
      return fail(400, { message: "Passwords do not match" });
    }

    try {
      passwordSchema.parse(newPassword);
      const passwordHash = await hash(newPassword, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      await db
        .update(table.user)
        .set({ passwordHash })
        .where(eq(table.user.id, event.locals.user.id));

      await auth.invalidateSession(event.locals.session.id);
      auth.deleteSessionTokenCookie(event);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const { errors } = z.treeifyError(e);
        return fail(400, { msg: errors });
      } else {
        console.error(e);
        return fail(500, { msg: "An error has occurred" });
      }
    }
    return redirect(302, "/crew/login");
  },
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
