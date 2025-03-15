<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import type { CommentsArray } from "$lib/types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { enhance } from "$app/forms";
  import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { Event, Comment } from "$lib/components";

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let event: EventObject = $derived(data.event[0] as EventObject);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);

  function addComment() {
    return async ({ update, result }) => {
      await update();
      if (result.type === "error") {
        console.error("Form submission failed:", result.status);
      }
    };
  }
</script>

<svelte:head>
  <title>{event ? event.title : "Vilnius Hardcore"}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<Event {...event} detailed={true} />
<strong><h2 id="comments">Comments</h2></strong>

<div class="comments">
  {#each comments as comment (comment.id)}
    <Comment {...comment} />
  {:else}
    <div>No comments found. Write something!</div>
  {/each}
</div>
<hr class="dim" />
<strong><h3>Add a comment</h3></strong>
<form
  class="comment"
  method="POST"
  action="?/add_comment"
  autocomplete="off"
  use:enhance={addComment}
>
  <label for="author">Name</label>
  <input id="author" name="author" required maxlength="30" />
  <div class="fieldError">{form?.errors?.author ?? ""}</div>
  <label id="content" for="content">Comment</label>
  <textarea name="content" spellcheck="false" required maxlength="250"
  ></textarea>
  <div class="fieldError">{form?.errors?.content ?? ""}</div>
  <br />
  <button type="submit" class="post action"
    ><Fa icon={faCommentDots} /> post</button
  >
</form>

<style>
  div.comments div {
    margin-bottom: 1em;
  }

  form.comment textarea {
    height: 3.5em;
  }
</style>
