import { paraglideMiddleware } from "#lib/paraglide/server.js";
import * as auth from "#lib/server/auth.js";
import {
  sequence,
  type Handle,
  type HandleServerError,
} from "@sveltejs/kit/hooks";
import { handleAppearance } from "@friendofsvelte/toggle";
import { startPolling } from "#lib/server/recordings.js";

startPolling();

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);
  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  try {
    const { session, user } = await auth.validateSessionToken(sessionToken);
    if (session) {
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } else {
      auth.deleteSessionTokenCookie(event);
    }

    event.locals.user = user;
    event.locals.session = session;
    return resolve(event);
  } catch (err) {
    console.error(err);
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
};

export const handleError: HandleServerError = async (input) => {
  console.error(input.error);

  // Unknown errors carry no typed status or message, skip them
  if (input.kind === "unknown") return;

  // Preserve the 413 (payload too large) status and its message so the client
  // sees the specific reason (e.g. a file that's too large) instead of a generic error.
  if (input.error.status === 413) {
    return { status: input.error.status, message: input.error.message };
  }
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ locale }) => {
    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html.replace("%paraglide.lang%", locale),
    });
  });

export const handle = sequence(handleAuth, handleAppearance, handleParaglide);
