<script lang="ts">
  import type { RecentCommentsData } from "$lib/types";
  import { getRelativeTimeString } from "$lib/relativeTime";
  let { recentComments }: { recentComments: RecentCommentsData } = $props();
</script>

<div class="recentComments">
  <h3><strong>Recent comments</strong></h3>
  <ul>
    {#each recentComments as comment (comment.id)}
      <li class="comment">
        <div class="content">
          {comment.author} on
          <a href="/events/{comment.event_slug}#comments"
            >{comment.event_name}</a
          >
        </div>
        <div class="font-size-small">
          {getRelativeTimeString(new Date(comment.date), "en")}
        </div>
      </li>
    {:else}
      <div>No comments found.</div>
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
