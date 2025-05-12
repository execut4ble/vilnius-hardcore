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

// export const handleError: HandleServerError = async ({
//   error,
//   message,
//   event,
// }) => {
//   console.error(error);

//   if ((error as { status?: number })?.status === 413) {
//     const isImageUpload = event.url.searchParams.has("/upload_image");
//     const errorMessage = (error as { message?: string })?.message;

//     if (isImageUpload && typeof errorMessage === "string") {
//       const parts = errorMessage.split(" ");
//       const limitBytes = parseInt(parts[6], 10);
//       const limitMB = isNaN(limitBytes)
//         ? null
//         : (limitBytes / 1048576).toFixed(2);

//       console.log("Returning image error");
//       return {
//         message: limitMB
//           ? `Image size exceeds limit of ${limitMB} MB`
//           : "Image size exceeds upload limit",
//       };
//     }
//   }

//   // For other errors, return the default message
//   console.log("Returning unknown error");
//   return {
//     message: message,
//   };
// };

export const handle = sequence(handleAuth, handleAppearance);
