<script lang="ts">
  import type { RecentCommentsData } from "$lib/types";
  let { recentComments }: { recentComments: RecentCommentsData } = $props();
</script>

<div class="recentComments">
  <h3><strong>Recent comments</strong></h3>
  <ul>
    {#each recentComments as comment (comment.id)}
      <li>
        {comment.author} on
        <a href="/events/{comment.event_slug}">{comment.event_name}</a>
      </li>
    {:else}
      <div>No comments found.</div>
    {/each}
  </ul>
</div>

<style>
</style>
