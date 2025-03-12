<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { PostComponent } from "$lib/types";
  import {
    faPenToSquare,
    faSave,
    faTrash,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import Markdown from "svelte-exmarkdown";
  import Fa from "svelte-fa";

  let { preview = false, ...post }: PostComponent = $props();

  let isEditing: boolean = $state(false);
  let title: string = $derived(post.title);
  let slug: string | null = $state(post.slug);
  let date: string = $derived(new Date(post.date).toLocaleString("lt-LT"));
  let author: string = $derived(post.authorName);
  let body: string = $derived(post.body);
  let previewBody: string = $derived(
    body ? body.substring(0, 500) + "\u2026" : "",
  );
  let confirmDelete: boolean = $state(false);

  function updatePost({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.data && result.data[0].slug !== slug) {
        goto(result.data[0].slug, { noScroll: true });
        isEditing = false;
        slug = result.data[0].slug;
      } else {
        await update().then(() => {
          isEditing = false;
        });
      }

      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }

  function removePost() {
    return async ({ update, result }) => {
      if (page.params.slug === slug) {
        goto("/blog", { noScroll: true });
      } else {
        await update();
      }
      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Delete failed:", result.status);
      }
    };
  }
</script>

<post>
  {#if !isEditing}
    {#if page.params.slug !== slug}
      <h2><a href="/blog/{slug}"><strong>{title}</strong></a></h2>
    {/if}
    {#if page.url.pathname !== "/" && page.data.user}
      <form method="POST" action="?/remove_post" use:enhance={removePost}>
        <input type="hidden" name="slug" value={slug} />
        <button class="post action" onclick={() => (isEditing = true)}
          ><Fa icon={faPenToSquare} /> edit</button
        >
        <button
          type="button"
          class="post action"
          onclick={() => (confirmDelete = true)}
        >
          <Fa icon={faTrash} /> delete</button
        >
        {#if confirmDelete}<br /><br />
          <strong>for real?</strong>
          <button
            class="post action"
            type="button"
            onclick={() => (confirmDelete = false)}>no!</button
          >
          <button class="post action" type="submit">yes!</button>
        {/if}
      </form>
    {/if}
    <div class="meta">Posted by {author ? author : "anonymous"} | {date}</div>
    <div class="content">
      {#if body && preview && body.length > 500}
        <Markdown md={previewBody} />
      {:else}
        <Markdown md={body} />
      {/if}
    </div>
  {:else}
    <form
      method="POST"
      action="?/update_post"
      autocomplete="off"
      use:enhance={updatePost}
    >
      <label for="title">Title</label>
      <input id="title" name="title" value={post.title} required />
      <label id="body" for="body">Post body</label>
      <textarea
        class="body"
        name="body"
        value={post.body}
        spellcheck="false"
        required
      ></textarea>
      <br />
      <button type="submit" class="post action"
        ><Fa icon={faSave} /> save</button
      >
      <button
        type="button"
        class="post action"
        onclick={() => {
          isEditing = false;
        }}><Fa icon={faXmark} /> cancel</button
      >
    </form>
  {/if}
</post>

<style>
  div.content {
    margin: 2em 0 2em 0;
  }

  textarea.body {
    width: 100%;
    max-width: 100%;
  }
</style>
