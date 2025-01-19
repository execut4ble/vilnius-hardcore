<script lang="ts">
  import type { RecentCommentsData } from "$lib/types";
  import TimeAgo from "javascript-time-ago";
  import en from "javascript-time-ago/locale/en";
  TimeAgo.setDefaultLocale(en.locale);
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");
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
        <div class="timeAgo">
          {timeAgo.format(new Date(comment.date))}
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
    margin-bottom: 0.2em;
  }

  div.timeAgo {
    font-size: 0.8em;
    font-weight: 200;
  }
</style>
