<script lang="ts">
  import type { PageProps } from "./$types";
  import { Event, Post } from "$lib/components";

  let { data }: PageProps = $props();
  let post = $derived(data.recentPost[0]);
</script>

<svelte:head>
  <title>Vilnius Hardcore</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

{#if post}
  <h2 class="blog">
    <strong>Recent news</strong>
  </h2>

  <div class="recent">
    <Post {...post} preview={true} />
    {#if post.body.length > 500}
      <div class="more"><a href="/blog/{post.slug}">read more...</a></div>
    {/if}
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
