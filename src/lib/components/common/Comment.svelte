<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import type { CommentComponent } from "$lib/types";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { SvelteDate } from "svelte/reactivity";

  let { ...comment }: CommentComponent = $props();
  let date: Date = $derived(new SvelteDate(comment.date));
  let confirmDelete: boolean = $state(false);
</script>

<div class="comment" transition:slide>
  <div class="heading">
    <span
      title={page.data.user
        ? `IP: ` + (comment.ipAddress ? comment.ipAddress : "not logged")
        : ""}><strong>{comment.author}</strong></span
    >
    {m.wrote_at()}
    {date.toLocaleString("lt-LT")}
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
          <strong>{m.delete()}?</strong>
          <button
            class="post action"
            type="button"
            onclick={() => (confirmDelete = false)}>{m.no()}</button
          >
          <button class="post action" type="submit">{m.yes()}</button>
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
    word-break: break-word;
  }

  div.comment form {
    display: inline-block;
    margin: 0;
  }
</style>
