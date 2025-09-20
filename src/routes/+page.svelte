<script lang="ts">
  import type { PageProps } from "./$types";
  import { Event, Post, MetaTags } from "$lib/components";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { resolve } from "$app/paths";

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
    <strong>{m.recent_news()}</strong>
  </h2>

  <div class="recent">
    <Post {...post} preview={true} />

    <div class={isOverflowing ? "more" : "more opaque"}>
      {#if isOverflowing}
        <a
          href={resolve("/blog/[slug]", { slug: post.slug as string })}
          transition:fade={{ duration: 200 }}>{m.read_more()}</a
        >
      {:else}
        <!-- Workaround to prevent layout shift -->
        <div>...</div>
      {/if}
    </div>
  </div>
{/if}

<h2 class="upcoming">
  <strong>{m.upcoming_events()}</strong>
</h2>

{#if data.events.length === 0}
  <p>{m["no_events.check_later"]()}</p>
  <p>
    {m["no_events.checkout"]()}
    <a href={resolve("/events")}>{m["no_events.past_events"]()}</a>
  </p>
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
