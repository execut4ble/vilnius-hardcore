import { paraglideMiddleware } from "$lib/paraglide/server";
import * as auth from "$lib/server/auth.js";
import type { Handle, HandleServerError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { handleAppearance } from "@friendofsvelte/toggle";

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await auth.validateSessionToken(sessionToken);
  if (session) {
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    auth.deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

export const handleError: HandleServerError = async ({ error, message }) => {
  console.error(error);

  if ((error as { status?: number })?.status === 413) {
    const errorMessage = (error as { message?: string })?.message;
    if (typeof errorMessage === "string") {
      return { status: 413, message: errorMessage };
    }
  }

  // For other errors, return the default message
  return { message };
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html.replace("%paraglide.lang%", locale),
    });
  });

export const handle = sequence(handleAuth, handleAppearance, handleParaglide);
