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
  validatePassword,
  validateUsername,
} from "$lib/server/user";

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
      return fail(401);
    }

    const formData = await event.request.formData();
    const currentPassword = formData.get("password");
    const newPassword = formData.get("newPass");
    const newPasswordRepeat = formData.get("newPassRepeat");

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

    if (!validatePassword(newPassword)) {
      return fail(400, { message: "New password is invalid" });
    }

    if (newPasswordRepeat !== newPassword) {
      return fail(400, { message: "Passwords do not match" });
    }

    const passwordHash = await hash(newPassword, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      if (event.locals.user === null) {
        return fail(403, { message: "Not logged in" });
      } else {
        await db
          .update(table.user)
          .set({ passwordHash })
          .where(eq(table.user.id, event.locals.user.id));
      }

      await auth.invalidateSession(event.locals.session.id);
      auth.deleteSessionTokenCookie(event);
    } catch (e) {
      console.error(e);
      return fail(500, { message: "An error has occurred" });
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

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username as string));

    const existingUser = results.at(0);
    if (existingUser) {
      return fail(400, { message: "This username is already taken" });
    }

    if (!validateUsername(username)) {
      return fail(400, { message: "Invalid username" });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: "Invalid password" });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await db
        .insert(table.user)
        .values({ id: userId, username, passwordHash });
    } catch (e) {
      console.error(e);
      return fail(500, { message: "An error has occurred" });
    }
    return {
      success: true,
      message: "Successfully registered " + username + "!",
    };
  },
};
