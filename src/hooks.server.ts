import type { Handle } from "@sveltejs/kit";
import { sql } from "$lib/db";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.sql = sql;
  const response = await resolve(event);
  return response;
};
