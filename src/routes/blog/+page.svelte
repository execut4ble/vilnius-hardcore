<script lang="ts">
  import { Post, ItemCount, FieldError } from "$lib/components";
  import { faAdd, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { goto, preloadData } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { slide } from "svelte/transition";

  let { data, form }: PageProps = $props();
  let posts = $derived(data.posts);

  let entryMode: boolean = $state(false);
  let displayedPosts: number | null = $derived(posts.length);
  let totalPosts: number | null = $derived(data.meta[0].totalPosts);
  let newPostTitle: string = $state("");
  let newPostBody: string = $state("");
  let confirmCancel: boolean = $state(false);

  function createPost() {
    return async ({ update, result }) => {
      await update();
      if (result.type === "success") {
        entryMode = false;
      }
      if (result.type === "error") {
        console.error("Form submission failed:", result.status);
      }
    };
  }

  function getNextPageURL() {
    const newUrl = new URL(page.url);
    const newPage = (Number(posts.length) + 5).toString();
    newUrl.searchParams.set("limit", newPage);
    return newUrl;
  }

  function preloadNextPage() {
    preloadData(getNextPageURL().toString());
  }

  async function loadMore() {
    goto(getNextPageURL().toString(), { noScroll: true }).then(() => {
      preloadNextPage();
    });
  }
</script>

<svelte:head>
  <title>Blog</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<h1>Blog</h1>
{#if data.user}
  {#if !entryMode}
    <button type="button" class="post action" onclick={() => (entryMode = true)}
      ><Fa icon={faAdd} /> add new</button
    >
  {:else}
    <div transition:slide>
      <h2><strong>Add new blog post</strong></h2>
      <div>
        <form
          class="newPost"
          method="POST"
          action="?/create_post"
          autocomplete="off"
          use:enhance={createPost}
        >
          <label for="title">Title</label>
          <input id="title" name="title" bind:value={newPostTitle} required />
          <FieldError errors={form?.errors?.title} />
          <label id="body" for="body">Post body</label>
          <textarea
            name="body"
            spellcheck="false"
            bind:value={newPostBody}
            required
          ></textarea>
          <FieldError errors={form?.errors?.body} />
          <br />
          <button type="submit" class="post action"
            ><Fa icon={faSave} /> save</button
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
      </div>
    </div>
  {/if}
{/if}

<ul class="postList">
  {#each data.posts as post (post.slug)}
    <li>
      <Post {...post} {form} />
    </li>
    <hr class="long" />
  {:else}
    <p>Nothing here!</p>
  {/each}
</ul>

{#if displayedPosts !== null && displayedPosts < (totalPosts !== null ? totalPosts : 0)}
  <button class="post action" onclick={loadMore} onmouseenter={preloadNextPage}
    >show more</button
  >
{/if}

<ItemCount displayedItems={displayedPosts} totalItems={totalPosts} />

<style>
  ul.postList {
    padding-left: 0;
  }

  ul.postList li {
    list-style: none;
  }

  ul.postList hr.long {
    width: 100%;
    color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 2em;
  }

  form.newPost textarea {
    width: 100%;
    max-width: 100%;
  }
</style>
