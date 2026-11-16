import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerInfo } from "#lib/server/server-info.js";

export const load = (async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/crew/login");
  }

  const info = await getServerInfo();
  return { info };
}) satisfies PageServerLoad;
