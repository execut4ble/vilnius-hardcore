<script lang="ts">
  import type { PageData } from "./$types";
  import type { VenueEvent } from "$lib/types";
  import Event from "../Event.svelte";

  let { data }: { data: PageData } = $props();
  const event: VenueEvent = $state(data.event[0] as VenueEvent);
</script>

<svelte:head>
  <title>{event.title}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <Event {...event} />
</section>
