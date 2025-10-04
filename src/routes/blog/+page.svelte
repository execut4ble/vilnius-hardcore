<script lang="ts">
  import { Post, ItemCount, PostEntryForm, MetaTags } from "$lib/components";
  import { faAdd } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { page } from "$app/state";
  import { goto, preloadData } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { SvelteURL } from "svelte/reactivity";

  let { data, form }: PageProps = $props();
  let posts = $derived(data.posts);

  let entryMode: boolean = $state(false);
  let displayedPosts: number | null = $derived(posts.length);
  let totalPosts: number | null = $derived(data.meta[0].totalPosts);

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
    const newUrl = new SvelteURL(page.url);
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
  <MetaTags title="Blog" />
</svelte:head>

<h1>{m["navigation.blog"]()}</h1>
{#if data.user}
  {#if !entryMode}
    <button
      type="button"
      class="post action new-post"
      onclick={() => (entryMode = true)}
      ><Fa icon={faAdd} /> {m.add_new()}</button
    >
  {:else}
    <div transition:slide>
      <h2><strong>{m.add_new_post()}</strong></h2>
      <div>
        <PostEntryForm
          {form}
          formAction="?/create_post"
          enhanceFunction={createPost}
          bind:entryMode
        />
      </div>
    </div>
  {/if}
{/if}

<ul class="postList">
  {#each data.posts as post (post.id)}
    <li transition:slide>
      <Post {...post} {form} />
    </li>
    <hr class="long" />
  {:else}
    <p transition:slide>{m.no_posts()}</p>
  {/each}
</ul>

{#if displayedPosts !== null && displayedPosts < (totalPosts !== null ? totalPosts : 0)}
  <button class="post action" onclick={loadMore} onmouseenter={preloadNextPage}
    >{m.show_more()}</button
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
</style>
