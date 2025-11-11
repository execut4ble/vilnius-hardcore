import { db } from "$lib/server/db";
import { and, eq, gte, sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { type RequestHandler } from "@sveltejs/kit";
import RSS from "rss";
import { markdownToText } from "$lib/utils/markdown";

export const GET: RequestHandler = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const events = await db
    .select()
    .from(table.event)
    .where(
      and(
        eq(table.event.is_visible, true),
        gte(table.event.date, sql`CURRENT_DATE`),
      ),
    );

  const feed = new RSS({
    title: "Vilnius Hardcore upcoming events",
    description: "Ska funk rasta punk scene, Vilnius, Lithuania",
    site_url: origin,
    feed_url: origin + "/events/feed.rss",
    image_url: "https://hardcore.lt/favicon.png",
  });

  // console.log(events);
  for (const i in events) {
    const dateString = events[i].date;
    const startTime = new Date(dateString);

    feed.item({
      guid: events[i].id.toString(),
      date: startTime,
      title: events[i].title,
      description: markdownToText(events[i].description as string),
      url: events[i].external_url
        ? events[i].external_url
        : origin + "/events/" + events[i].slug,
      enclosure: {
        url: events[i].image ? origin + "/images/" + events[i].image : "",
        type: "image/jpeg",
      },
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
