import {
  and,
  eq,
  gte,
  lt,
  desc,
  asc,
  count,
  sql,
  getTableColumns,
} from "drizzle-orm";
import * as table from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import type { EventsArray } from "$lib/types";

const commentCounts = db
  .select({
    eventId: table.comment.eventId,
    comments: count(table.comment.id).as("comments"),
  })
  .from(table.comment)
  .groupBy(table.comment.eventId)
  .as("c");

const loadEvents = async (
  locals: App.Locals,
  limit: number,
  direction: "upcoming" | "past",
  includeComments: boolean,
) => {
  const visibilityCondition = locals.user
    ? undefined
    : eq(table.event.is_visible, true);

  const dateCondition =
    direction === "upcoming"
      ? gte(table.event.date, sql`CURRENT_DATE`)
      : lt(table.event.date, sql`CURRENT_DATE`);

  const orderDirection =
    direction === "upcoming" ? asc(table.event.date) : desc(table.event.date);

  if (includeComments) {
    return db
      .select({
        ...getTableColumns(table.event),
        comments: sql<number>`coalesce(${commentCounts.comments}, 0)`,
      })
      .from(table.event)
      .leftJoin(commentCounts, eq(table.event.id, commentCounts.eventId))
      .where(and(dateCondition, visibilityCondition))
      .orderBy(orderDirection)
      .limit(limit);
  }

  return db
    .select(getTableColumns(table.event))
    .from(table.event)
    .where(and(dateCondition, visibilityCondition))
    .orderBy(orderDirection)
    .limit(limit);
};

export const loadUpcomingEvents = async (
  locals: App.Locals,
  limit: number,
  includeComments = true,
) => {
  return (await loadEvents(
    locals,
    limit,
    "upcoming",
    includeComments,
  )) as unknown as EventsArray;
};

export const loadArchivedEvents = async (
  locals: App.Locals,
  limit: number,
  includeComments = true,
) => {
  return (await loadEvents(
    locals,
    limit,
    "past",
    includeComments,
  )) as unknown as EventsArray;
};
