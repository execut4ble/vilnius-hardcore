<script lang="ts">
  import type { RecentCommentsData } from "$lib/types";
  let { recentComments }: { recentComments: RecentCommentsData } = $props();
  import { relativeTime } from "svelte-relative-time";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
</script>

<div class="recentComments">
  <h3><strong>{m.recentcomments()}</strong></h3>
  <ul>
    {#each recentComments as comment (comment.id)}
      <li class="comment" transition:slide>
        <div class="content">
          {comment.author} on
          {#if comment.event_slug}
            <a href="/events/{comment.event_slug}#comments"
              >{comment.event_name}</a
            >
          {:else}
            <a href="/blog/{comment.post_slug}#comments">{comment.post_title}</a
            >
          {/if}
        </div>
        <div
          class="font-size-small"
          use:relativeTime={{ date: new Date(comment.date) }}
        >
          some time ago
        </div>
      </li>
    {:else}
      <div transition:slide>No comments found.</div>
    {/each}
  </ul>
</div>

<style>
  li.comment {
    margin-bottom: 1.5em;
  }

  li.comment .content {
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
