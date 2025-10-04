<script lang="ts">
  import type { PageProps } from "./$types";
  import type { CommentsArray } from "$lib/types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { Event, Comment, AddCommentForm, MetaTags } from "$lib/components";
  import { slide } from "svelte/transition";
  import { page } from "$app/state";
  import { m } from "$lib/paraglide/messages";

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
<hr class="long" />
<strong><h2 id="comments">{m.comment_plural()}</h2></strong>

{#key event.id}
  <div class="comments">
    {#each comments as comment (comment.id)}
      <Comment {...comment} />
    {:else}
      <div transition:slide>{m.no_comments()}</div>
    {/each}
  </div>
  <AddCommentForm {form} />
{/key}

<style>
  div.comments div {
    margin-bottom: 1em;
  }

  h2 {
    text-transform: capitalize;
  }
</style>
