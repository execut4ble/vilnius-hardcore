<script lang="ts">
  import type { PageData } from "./$types";
  import Event from "./Event.svelte";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Events</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h1>Events</h1>
  <ul class="eventList">
    {#each data.events as event}
      <li>
        <Event {...event} />
      </li>
    {/each}
  </ul>
</section>

<style>
  ul.eventList li {
    list-style: none;
  }
</style>
