<script lang="ts">
  import type { PageProps } from "./$types";
  import { Event, Post, MetaTags } from "$lib/components";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let { data }: PageProps = $props();
  let post = $derived(data.recentPost[0]);
  let isOverflowing = $state(false);

  const isTextClamped = (elm) => elm.scrollHeight > elm.clientHeight;

  onMount(() => {
    const element = document.querySelector(".content.preview");

    isOverflowing = isTextClamped(element);
  });
</script>

<svelte:head>
  <MetaTags />
</svelte:head>

{#if post}
  <h2 class="blog">
    <strong>Recent news</strong>
  </h2>

  <div class="recent">
    <Post {...post} preview={true} />

    <div class={isOverflowing ? "more" : "more opaque"}>
      {#if isOverflowing}
        <a href="/blog/{post.slug}" transition:fade={{ duration: 200 }}
          >read more...</a
        >
      {:else}
        <!-- Workaround to prevent layout shift -->
        <div>...</div>
      {/if}
    </div>
  </div>
{/if}

<h2 class="upcoming">
  <strong>Upcoming events</strong>
</h2>

{#if data.events.length === 0}
  <p>We have no upcoming events right now! Check back later!</p>
  <p>Or check out our <a href="/events">past events</a></p>
{/if}
<ul class="eventList">
  {#each data.events as event (event.slug)}
    <li>
      <Event {...event} />
    </li>
  {/each}
</ul>

<style>
  h2.blog {
    text-align: center;
  }

  h2.upcoming {
    text-align: center;
  }

  ul.eventList {
    padding-left: 0;
  }

  ul.eventList li {
    list-style: none;
  }

  div.more {
    margin-bottom: 2em;
  }
</style>
