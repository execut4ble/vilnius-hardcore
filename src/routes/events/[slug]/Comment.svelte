<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  let { ...comment } = $props();
  let date: Date = $derived(new Date(comment.date));
  let confirmDelete: boolean = $state(false);
</script>

<div class="comment">
  <div class="heading">
    <strong>{comment.author}</strong> wrote at {date.toLocaleString("lt-LT")}
    {#if page.data.user}
      <form method="POST" action="?/remove_comment" use:enhance>
        <input type="hidden" name="id" value={comment.id} />
        <button
          type="button"
          class="post action"
          onclick={() => (confirmDelete = true)}
        >
          <Fa icon={faTrash} /></button
        >
        {#if confirmDelete}
          <strong>delete?</strong>
          <button
            class="post action"
            type="button"
            onclick={() => (confirmDelete = false)}>no!</button
          >
          <button class="post action" type="submit">yes!</button>
        {/if}
      </form>
    {/if}
  </div>

  <div class="content">
    {comment.content}
  </div>
</div>

<style>
  div.comment {
    margin-bottom: 2em;
  }

  div.comment .heading {
    margin-bottom: 1em;
  }

  div.comment .content {
    margin-left: 0.5em;
  }

  div.comment form {
    display: inline-block;
    margin: 0;
  }
</style>
