<script lang="ts">
  import type { PageProps } from "./$types";
  import type { CommentsArray } from "$lib/types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { Event, Comment, AddCommentForm, MetaTags } from "$lib/components";
  import { slide } from "svelte/transition";
  import { page } from "$app/state";

  let { data, form }: PageProps = $props();
  let event: EventObject = $derived(data.event[0] as EventObject);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);
</script>

<svelte:head>
  <MetaTags
    title={event ? event.title : "Vilnius Hardcore"}
    image={page.url.origin + "/images/" + event.image}
  />
</svelte:head>

<Event {...event} {form} detailed={true} />
<strong><h2 id="comments">Comments</h2></strong>

{#key event.id}
  <div class="comments">
    {#each comments as comment (comment.id)}
      <Comment {...comment} />
    {:else}
      <div transition:slide>No comments found. Write something!</div>
    {/each}
  </div>

  <hr class="dim" />
  <AddCommentForm {form} />
{/key}

<style>
  div.comments div {
    margin-bottom: 1em;
  }
</style>
