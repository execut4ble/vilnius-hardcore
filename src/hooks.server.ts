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

export const handleError: HandleServerError = async ({
  error,
  status,
  message,
}) => {
  console.log("Custom error handling:", error.status);
  console.log("Status:", status);
  console.log("Message:", message);
  if (error.status === 413) {
    console.log("Payload too large, returning message...");
    return {
      message: "Payload Too Large",
    };
  }

  // For other errors, return the default message
  return {
    message: message,
  };
};

export const handle = sequence(handleAuth, handleAppearance);
