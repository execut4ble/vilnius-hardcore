<script lang="ts">
  import { enhance } from "$app/forms";
  import { FieldError } from "$lib/components";
  import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { page } from "$app/state";

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
  id="add-post"
  method="POST"
  action={formAction}
  autocomplete="off"
  use:enhance={enhanceFunction}
>
  <label for="title">{m["form.title"]()}</label>
  {#if post.title}
    <input id="title" name="title" value={post.title} required />
  {:else}
    <input id="title" name="title" bind:value={newPostTitle} required />
  {/if}
  <FieldError errors={form?.errors?.title} />
  <label id="body" for="body">{m["form.body"]()}</label>
  {#if post.body}
    <textarea
      id="description"
      name="body"
      spellcheck="false"
      value={post.body}
      required
    ></textarea>
  {:else}
    <textarea
      id="description"
      name="body"
      spellcheck="false"
      bind:value={newPostBody}
      required
    ></textarea>
  {/if}
  <FieldError errors={form?.errors?.body} />
  {#if page.data.globalCommentsEnabled}
    <label for="disable_comments"
      ><input
        type="checkbox"
        id="disable_comments"
        name="disable_comments"
        checked={post.disable_comments}
      />
      {m["form.disable_comments"]()}</label
    >
  {/if}
  <br />
  <button type="submit" class="post action"
    ><Fa icon={faSave} /> {m.save()}</button
  >
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
    }}><Fa icon={faXmark} /> {m.cancel()}</button
  >
  {#if confirmCancel}<br /><br />
    <div transition:slide>
      <strong>{m.cancel_confirm()}</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmCancel = false)}>{m.no()}</button
      >
      <button
        type="button"
        class="post action"
        onclick={() => {
          entryMode = false;
          newPostTitle = "";
          newPostBody = "";
          confirmCancel = false;
        }}>{m.yes()}</button
      >
    </div>
  {/if}
</form>

<style>
  form#add-post textarea {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
</style>
