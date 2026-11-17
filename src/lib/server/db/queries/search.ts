import { eq } from "drizzle-orm";
import * as table from "#lib/server/db/schema.js";
import { db } from "#lib/server/db/index.js";
import { markdownToText } from "#lib/utils/markdown.js";
import type { SearchRow, SearchResults } from "#lib/types.js";

const MAX_TERMS = 5;
const MAX_LIMIT = 20;

// Per-field score. A whole-word hit scores `word` instead of `substring`, so
// the ordering is exactly: title word > body word > title substring > body substring
const SCORE = {
  title: { word: 10, substring: 2 },
  body: { word: 5, substring: 1 },
} as const;

type Candidate = Omit<SearchRow, "score" | "total">;
type Matcher = { term: string; word: RegExp };

// Lowercase and strip diacritics for case- and accent-insensitive matching
const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

// Folded, de-duplicated terms ("foo foo" shouldn't double the score)
const termsOf = (query: string) =>
  [...new Set(fold(query).split(/\s+/).filter(Boolean))].slice(0, MAX_TERMS);

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Unicode-aware word edges. \b is ASCII-only and fails for terms that start
// or end with punctuation, such as "c++" or "#tag".
const toMatcher = (term: string): Matcher => ({
  term,
  word: new RegExp(
    `(?<![\\p{L}\\p{N}_])${escapeRegex(term)}(?![\\p{L}\\p{N}_])`,
    "u",
  ),
});

const fieldScore = (
  text: string,
  { term, word }: Matcher,
  s: { word: number; substring: number },
) => (word.test(text) ? s.word : text.includes(term) ? s.substring : 0);

// Everything the DB has to do: fetch rows, hide invisible events from guests
const fetchCandidates = async (isLoggedIn: boolean): Promise<Candidate[]> => {
  const { event, post, user, comment } = table;

  const [events, posts] = await Promise.all([
    db
      .select({
        id: event.id,
        title: event.title,
        date: event.date,
        body: event.description,
        slug: event.slug,
        image: event.image,
        is_visible: event.is_visible,
        external_url: event.external_url,
        disable_comments: event.disable_comments,
        comments: db
          .$count(comment, eq(comment.eventId, event.id))
          .as("comments"),
      })
      .from(event)
      .where(isLoggedIn ? undefined : eq(event.is_visible, true)),
    db
      .select({
        id: post.id,
        title: post.title,
        date: post.date,
        body: post.body,
        slug: post.slug,
        image: post.image,
        disable_comments: post.disable_comments,
        author_name: post.authorName,
        author_username: user.username,
        comments: db
          .$count(comment, eq(comment.postId, post.id))
          .as("comments"),
      })
      .from(post)
      .leftJoin(user, eq(user.id, post.author)),
  ]);

  return [
    ...events.map((e) => ({
      ...e,
      type: "event" as const,
      date: new Date(e.date), // event dates are strings (mode: "string")
      author_name: null,
      author_username: null,
    })),
    ...posts.map((p) => ({
      ...p,
      type: "post" as const,
      is_visible: true,
      external_url: null,
    })),
  ];
};

// Pure: filter by "every term appears somewhere", then score and sort
const rank = (candidates: Candidate[], terms: string[]) => {
  const matchers = terms.map(toMatcher);

  return candidates
    .map((row) => ({
      row,
      title: fold(row.title),
      body: row.body ? fold(markdownToText(row.body)) : "",
    }))
    .filter(({ title, body }) =>
      matchers.every(({ term }) => title.includes(term) || body.includes(term)),
    )
    .map(({ row, title, body }) => ({
      row,
      score: matchers.reduce(
        (sum, m) =>
          sum +
          fieldScore(title, m, SCORE.title) +
          fieldScore(body, m, SCORE.body),
        0,
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || b.row.date.getTime() - a.row.date.getTime(),
    );
};

export const searchEventsAndPosts = async (
  locals: App.Locals,
  query: string,
  limit = MAX_LIMIT,
): Promise<SearchResults> => {
  const terms = termsOf(query);
  if (terms.length === 0) return { results: [], total: 0 };

  const ranked = rank(await fetchCandidates(Boolean(locals.user)), terms);
  const pageSize = Math.max(0, Math.min(limit, MAX_LIMIT));

  return {
    results: ranked
      .slice(0, pageSize)
      .map(({ row, score }) => ({ ...row, score, total: ranked.length })),
    total: ranked.length,
  };
};
