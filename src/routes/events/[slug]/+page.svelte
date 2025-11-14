<script lang="ts">
  import type { PageProps } from "./$types";
  import type { CommentsArray } from "$lib/types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { Event, Comment, AddCommentForm, MetaTags } from "$lib/components";
  import { slide } from "svelte/transition";
  import { page } from "$app/state";
  import { m } from "$lib/paraglide/messages";
  import { markdownToText } from "$lib/utils/markdown";

  let { data, form }: PageProps = $props();
  let event: EventObject = $derived(data.event[0] as EventObject);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);
</script>

<svelte:head>
  <MetaTags
    title={event ? event.title : undefined}
    image={event.image ? page.url.origin + "/images/" + event.image : undefined}
    description={event.description
      ? markdownToText(event.description)
      : undefined}
  />
</svelte:head>

<Event {...event} {form} detailed={true} />
<hr class="long" />
<strong><h2 id="comments">{m.comment_plural()}</h2></strong>

{#key event.id}
  <div id="comments-list">
    {#each comments as comment (comment.id)}
      <Comment {...comment} />
    {:else}
      {#if !event.disable_comments}
        <div class="text-block" transition:slide>{m.no_comments()}</div>
      {/if}
    {/each}
  </div>
  {#if event.disable_comments}
    <div class="text-block" transition:slide>{m.comments_disabled()}</div>
  {:else}
    <AddCommentForm {form} />
  {/if}
{/key}

<style>
  h2 {
    text-transform: capitalize;
  }
</style>
