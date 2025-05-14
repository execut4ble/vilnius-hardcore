import { db } from "$lib/server/db";
import { json, type RequestHandler } from "@sveltejs/kit";
import * as table from "$lib/server/db/schema";
import { desc } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
  const offset = Number(url.searchParams.get("offset")) || 0;

  const shouts = (
    await db
      .select()
      .from(table.shout)
      .orderBy(desc(table.shout.date))
      .limit(5)
      .offset(offset)
  ).reverse();

  return json(shouts);
};
