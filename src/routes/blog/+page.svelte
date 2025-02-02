<script lang="ts">
  import type { PageData } from "./$types";
  import Post from "./Post.svelte";
  import { faAdd, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ItemCount from "../ItemCount.svelte";

  let { data }: { data: PageData } = $props();
  let posts = $derived(data.posts);

  let entryMode: boolean = $state(false);
  let displayedPosts: number | null = $derived(posts.length);
  let totalPosts: number | null = $derived(data.meta[0].totalPosts);

  function createPost() {
    return async ({ update, result }) => {
      await update().then((entryMode = false));

      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }

  async function loadMore() {
    const newUrl = new URL(page.url);
    const newPage = (Number(posts.length) + 5).toString();
    newUrl.searchParams.set("limit", newPage);
    goto(newUrl, { noScroll: true });
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
        <input id="title" name="title" required />
        <label id="body" for="body">Post body</label>
        <textarea name="body" spellcheck="false" required></textarea>
        <br />
        <button type="submit" class="post action"
          ><Fa icon={faSave} /> save</button
        >
        <button
          type="button"
          class="post action"
          onclick={() => (entryMode = false)}
          ><Fa icon={faXmark} /> cancel</button
        >
      </form>
    </div>
  {/if}
{/if}

<ul class="postList">
  {#each data.posts as post (post.slug)}
    <li>
      <Post {...post} />
    </li>
    <hr class="long" />
  {:else}
    <p>Nothing here!</p>
  {/each}
</ul>

{#if displayedPosts !== null && displayedPosts < (totalPosts !== null ? totalPosts : 0)}
  <button class="post action" onclick={loadMore}>show more</button>
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
    margin-bottom: 2em;
  }

  form.newPost textarea {
    width: 100%;
    max-width: 100%;
  }
</style>
