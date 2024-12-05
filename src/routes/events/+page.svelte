<script lang="ts">
  import type { PageData } from "./$types";
  import Event from "./Event.svelte";
  import type { VenueEvent } from "$lib/types";

  let { data }: { data: PageData } = $props();

  const events: Array<VenueEvent> = $state(data.events as Array<VenueEvent>);

  const upcomingEvents: Array<VenueEvent> = $derived(
    events.filter((event) => event.date > new Date())
  );

  const pastEvents: Array<VenueEvent> = $derived(
    events.filter((event) => event.date < new Date()).reverse()
  );
</script>

<svelte:head>
  <title>Events</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h1>Events</h1>
  <h2><strong>Upcoming events</strong></h2>
  <ul class="eventList">
    {#each upcomingEvents as event}
      <li>
        <Event {...event} detailed={false} />
      </li>
    {/each}
  </ul>

  <h2><strong>Past events</strong></h2>
  <ul class="eventList">
    {#each pastEvents as event}
      <li>
        <Event {...event} detailed={false} />
      </li>
    {/each}
  </ul>
</section>

<style>
  ul.eventList {
    padding-left: 0;
  }

  ul.eventList li {
    list-style: none;
  }
</style>
