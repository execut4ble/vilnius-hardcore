<script lang="ts">
  import Event from "./events/Event.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Hardcore</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h2 class="upcoming">
    <strong>Upcoming events</strong>
  </h2>

  {#if data.events.length === 0}
    <p>We have no upcoming events right now! Check back later!</p>
  {/if}
  <ul class="eventList">
    {#each data.events as event}
      <li>
        <Event {...event} detailed={false} />
      </li>
    {/each}
  </ul>
</section>

<style>
  h2.upcoming {
    text-align: center;
  }

  ul.eventList li {
    list-style: none;
  }
</style>
