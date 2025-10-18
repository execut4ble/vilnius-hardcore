<script lang="ts">
  import type { RecentCommentsData } from "$lib/types";
  let { recentComments }: { recentComments: RecentCommentsData } = $props();
  import { relativeTime } from "svelte-relative-time";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale } from "$lib/paraglide/runtime";
  import { SvelteDate } from "svelte/reactivity";
  import { resolve } from "$app/paths";
</script>

<div id="recent-comments">
  <h3><strong>{m.recent_comments()}</strong></h3>
  <ul>
    {#each recentComments as comment (comment.id)}
      <li class="comment" transition:slide>
        <div class="comment-content">
          {comment.author}
          {m.commented_on()}
          {#if comment.event_slug}
            <a
              href={resolve("/events/[slug]", {
                slug: comment.event_slug as string,
              }) + "#comments"}>{comment.event_name}</a
            >
          {:else}
            <a
              href={resolve("/blog/[slug]", {
                slug: comment.post_slug as string,
              }) + "#comments"}>{comment.post_title}</a
            >
          {/if}
        </div>
        <span
          class="font-size-small"
          title={new SvelteDate(comment.date).toLocaleString("lt-LT")}
          use:relativeTime={{
            date: new SvelteDate(comment.date),
            locale: getLocale(),
          }}
        >
          &nbsp;
        </span>
      </li>
    {:else}
      <div transition:slide>{m.no_comments()}</div>
    {/each}
  </ul>
</div>

<style>
  div#recent-comments ul {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  li.comment .comment-content {
    word-break: break-word;
    margin-bottom: 0.2em;
  }

  li.comment a {
    color: var(--color-text-2);
  }
  li.comment a:hover {
    color: var(--link-hover-color);
  }
</style>
