import { verify } from "@node-rs/argon2";
import { hash } from "@node-rs/argon2";
import * as auth from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { passwordSchema } from "$lib/server/user";
import { z } from "zod";

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
    // As a workaround to not display duplicate form error messages
    // The error message key is called msg instead of message
    // See form.msg errors in crew/+page.svelte
    if (!event.locals.session) {
      return fail(401, { msg: "Not logged in" });
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
      return fail(400, { msg: "User not found" });
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
      return fail(400, { msg: "Current password is invalid" });
    }

    if (newPasswordRepeat !== newPassword) {
      return fail(400, { msg: "Passwords do not match" });
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
};
