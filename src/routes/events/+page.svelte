<script lang="ts">
  import type { PageData } from "./$types";

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
        <h2><strong>{event.title}</strong></h2>
        {event.date}
        <p>{event.description}</p>
      </li>
    {/each}
  </ul>
</section>
