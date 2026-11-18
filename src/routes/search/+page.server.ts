import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { searchEventsAndPosts } from "#lib/server/db/queries/search.js";
import type { SearchResult } from "#lib/types.js";
import { eventActions } from "#lib/server/actions/event.actions.js";
import { postActions } from "#lib/server/actions/post.actions.js";

const MAX_QUERY_LENGTH = 100;
const MIN_QUERY_LENGTH = 2;

const normalizeQuery = (raw: string) => raw.trim().slice(0, MAX_QUERY_LENGTH);

const isValidQuery = (query: string) => query.length >= MIN_QUERY_LENGTH;

export const load = (async ({
  locals,
  url,
}): Promise<{ query: string; results: SearchResult[]; total: number }> => {
  const query = normalizeQuery(url.searchParams.get("query") ?? "");

  if (!isValidQuery(query)) {
    return { query: "", results: [], total: 0 };
  }

  const { results: rows, total } = await searchEventsAndPosts(locals, query);

  return {
    query,
    results: rows.map((row) =>
      row.type === "event"
        ? {
            type: "event",
            id: row.id,
            title: row.title,
            // Normalize the date like the event list pages do
            date: new Date(row.date).toLocaleString("lt").replace(" ", "T"),
            description: row.body,
            slug: row.slug,
            image: row.image,
            is_visible: row.is_visible,
            external_url: row.external_url,
            disable_comments: row.disable_comments,
            comments: row.comments,
          }
        : {
            type: "post",
            id: row.id,
            title: row.title,
            date: row.date,
            body: row.body as string,
            slug: row.slug,
            image: row.image,
            authorName: row.author_name,
            authorUsername: row.author_username,
            disable_comments: row.disable_comments,
            comments: row.comments,
          },
    ),
    total,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  ...eventActions,
  ...postActions,
  query: async ({ request }) => {
    const formData = await request.formData();
    const query = normalizeQuery((formData.get("query") ?? "").toString());
    return redirect(
      302,
      isValidQuery(query)
        ? `/search?query=${encodeURIComponent(query)}`
        : "/search",
    );
  },
};
