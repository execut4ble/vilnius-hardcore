import {
  and,
  desc,
  eq,
  sql,
  ilike,
  type AnyColumn,
  type SQL,
  or,
} from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import * as table from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import type { SearchRow, SearchResults } from "$lib/types";

const MAX_TERMS = 5;
const MAX_LIMIT = 20;

const termsOf = (query: string) =>
  query.trim().split(/\s+/).filter(Boolean).slice(0, MAX_TERMS);

// Escape LIKE wildcards so input like "50%" or "snake_case" matches literally
const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

// Case- and accent-insensitive match
const matches = (col: AnyColumn, term: string) =>
  ilike(sql`unaccent(${col})`, `%${escapeLike(term)}%`);

// Every term must match in the title or the body
const termCondition = (title: AnyColumn, body: AnyColumn, terms: string[]) =>
  and(...terms.map((t) => or(matches(title, t), matches(body, t))));

// Title matches (2) rank above body matches (1)
const score = (
  title: AnyColumn,
  body: AnyColumn,
  terms: string[],
): SQL<number> =>
  sql<number>`${sql.join(
    terms.map(
      (t) =>
        sql`(CASE WHEN ${matches(title, t)} THEN 2 ELSE 0 END + CASE WHEN ${matches(body, t)} THEN 1 ELSE 0 END)`,
    ),
    sql` + `,
  )}`;

export const searchEventsAndPosts = async (
  locals: App.Locals,
  query: string,
  limit = MAX_LIMIT,
): Promise<SearchResults> => {
  const terms = termsOf(query);

  if (terms.length === 0) {
    return { results: [], total: 0 };
  }

  const { event, post, user, comment } = table;

  // Both branches must select the same fields with the same keys, order and
  // types for unionAll to type-check.
  const events = db
    .select({
      type: sql<"event" | "post">`'event'::text`.as("type"),
      id: event.id,
      title: event.title,
      // Event dates come back as strings (mode: "string") while post dates
      // are Dates; normalize so both branches match in the union
      date: sql<Date>`${event.date}`.mapWith((v) => new Date(v)).as("date"),
      body: sql<string | null>`${event.description}`.as("body"),
      slug: event.slug,
      image: event.image,
      is_visible: event.is_visible,
      external_url: event.external_url,
      disable_comments: event.disable_comments,
      author_name: sql<string | null>`null::text`.as("author_name"),
      author_username: sql<string | null>`null::text`.as("author_username"),
      comments: db
        .$count(comment, eq(comment.eventId, event.id))
        .as("comments"),
      score: score(event.title, event.description, terms).as("score"),
    })
    .from(event)
    .where(
      and(
        termCondition(event.title, event.description, terms),
        locals.user ? undefined : eq(event.is_visible, true),
      ),
    );

  const posts = db
    .select({
      type: sql<"event" | "post">`'post'::text`.as("type"),
      id: post.id,
      title: post.title,
      date: post.date,
      body: sql<string | null>`${post.body}`.as("body"),
      slug: post.slug,
      image: post.image,
      is_visible: sql<boolean>`true`.as("is_visible"),
      external_url: sql<string | null>`null::text`.as("external_url"),
      disable_comments: post.disable_comments,
      author_name: post.authorName,
      author_username: user.username,
      comments: db.$count(comment, eq(comment.postId, post.id)).as("comments"),
      score: score(post.title, post.body, terms).as("score"),
    })
    .from(post)
    .leftJoin(user, eq(user.id, post.author))
    .where(termCondition(post.title, post.body, terms));

  const results = unionAll(events, posts).as("results");
  const fields = results._.selectedFields;

  const rows = await db
    .select({
      ...fields,
      total: sql<number>`count(*) over ()`.mapWith(Number),
    })
    .from(results)
    .orderBy(desc(fields.score), desc(fields.date))
    .limit(Math.min(limit, MAX_LIMIT));

  return { results: rows as SearchRow[], total: rows[0]?.total ?? 0 };
};
