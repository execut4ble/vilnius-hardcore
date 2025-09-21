import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { asc } from "drizzle-orm";

export const load = (async ({ locals, params }) => {
  if (!locals.user) {
    return redirect(302, "/crew/login");
  } else {
    try {
      const banlist = await db
        .select({
          id: table.bannedIp.id,
          ipAddress: table.bannedIp.ipAddress,
          date: table.bannedIp.date,
        })
        .from(table.bannedIp)
        .orderBy(asc(table.bannedIp.date));

      return { banlist };
    } catch (error) {
      console.error(error);
    }
  }
}) satisfies PageServerLoad;
