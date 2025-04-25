<script lang="ts">
  import { enhance } from "$app/forms";
  import { FieldError } from "$lib/components";
  import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";

  let {
    form,
    formAction,
    entryMode = $bindable(),
    enhanceFunction,
    ...post
  } = $props();

  let newPostTitle: string = $state("");
  let newPostBody: string = $state("");
  let confirmCancel: boolean = $state(false);
</script>

<form
  class="newPost"
  method="POST"
  action={formAction}
  autocomplete="off"
  use:enhance={enhanceFunction}
>
  <label for="title">Title</label>
  {#if post.title}
    <input id="title" name="title" value={post.title} required />
  {:else}
    <input id="title" name="title" bind:value={newPostTitle} required />
  {/if}
  <FieldError errors={form?.errors?.title} />
  <label id="body" for="body">Post body</label>
  {#if post.body}
    <textarea name="body" spellcheck="false" value={post.body} required
    ></textarea>
  {:else}
    <textarea name="body" spellcheck="false" bind:value={newPostBody} required
    ></textarea>
  {/if}
  <FieldError errors={form?.errors?.body} />
  <br />
  <button type="submit" class="post action"><Fa icon={faSave} /> save</button>
  <button
    type="button"
    class="post action"
    onclick={() => {
      if (!newPostTitle && !newPostBody) {
        entryMode = false;
        confirmCancel = false;
      } else {
        confirmCancel = true;
      }
    }}><Fa icon={faXmark} /> cancel</button
  >
  {#if confirmCancel}<br /><br />
    <div transition:slide>
      <strong>really cancel?</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmCancel = false)}>no!</button
      >
      <button
        type="button"
        class="post action"
        onclick={() => {
          entryMode = false;
          newPostTitle = "";
          newPostBody = "";
          confirmCancel = false;
        }}>yes!</button
      >
    </div>
  {/if}
</form>

<style>
  form.newPost textarea {
    width: 100%;
    max-width: 100%;
  }
</style>
