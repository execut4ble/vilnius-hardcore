import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { asc, eq } from "drizzle-orm";

export const load = (async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, "/crew/login");
  } else {
    const banlist = await db
      .select({
        id: table.bannedIp.id,
        ipAddress: table.bannedIp.ipAddress,
        date: table.bannedIp.date,
      })
      .from(table.bannedIp)
      .orderBy(asc(table.bannedIp.date));

    return { banlist };
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  remove_ip: async (event) => {
    const formData = await event.request.formData();
    const banId: FormDataEntryValue | null = formData.get("id");
    await db
      .delete(table.bannedIp)
      .where(eq(table.bannedIp.id, banId as unknown as number));
  },
};
