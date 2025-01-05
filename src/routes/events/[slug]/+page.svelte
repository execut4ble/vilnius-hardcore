<script lang="ts">
  import type { PageData } from "./$types";
  import type { CommentsArray, EventObject } from "$lib/types";
  import Event from "../Event.svelte";
  import { enhance } from "$app/forms";
  import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import Comment from "./Comment.svelte";

  let { data }: { data: PageData } = $props();
  let event: EventObject = $state(data.event[0] as EventObject);
  let comments: CommentsArray = $state(data.comments as CommentsArray);
</script>

<svelte:head>
  <title>{event ? event.title : "Vilnius Hardcore"}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <Event {...event} detailed={true} />

  <strong><h2>Comments</h2></strong>

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
    use:enhance
  >
    <label for="author">Name</label>
    <input id="author" name="author" required />
    <label id="content" for="content">Comment</label>
    <textarea name="content" spellcheck="false" required maxlength="250"
    ></textarea>
    <br />
    <button type="submit" class="post action"
      ><Fa icon={faCommentDots} /> post</button
    >
  </form>
</section>

<style>
  div.comments div {
    margin-bottom: 1em;
  }

  form.comment textarea {
    height: 3.5em;
  }
</style>
