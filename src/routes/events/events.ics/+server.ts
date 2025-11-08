import { db } from "$lib/server/db";
import { and, eq, gte, sql } from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { type RequestHandler } from "@sveltejs/kit";
import ical, { ICalCalendarMethod } from "ical-generator";
import { markdownToText } from "$lib/utils/markdown";

export const GET: RequestHandler = async () => {
  const events = await db
    .select()
    .from(table.event)
    .where(
      and(
        eq(table.event.is_visible, true),
        gte(table.event.date, sql`NOW() - INTERVAL '30 days'`),
      ),
    );

  const calendar = ical({ name: "Vilnius Hardcore events" });

  // A method is required for outlook to display event as an invitation
  calendar.method(ICalCalendarMethod.REQUEST);

  for (const i in events) {
    const startTime = new Date(events[i].date);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 3);

    calendar.createEvent({
      id: events[i].id,
      start: startTime,
      end: endTime,
      summary: events[i].title,
      description: markdownToText(events[i].description as string) as
        | string
        | null,
      timezone: "Europe/Vilnius",
      url: events[i].external_url
        ? events[i].external_url
        : "https://vilnius.hardcore.lt/",
    });
  }

  return new Response(calendar.toString(), {
    headers: {
      "Cache-Control": "max-age=3600, must-revalidate",
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="events.ics"',
    },
  });
};
