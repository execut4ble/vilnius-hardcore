<script lang="ts">
  import type { PageData } from "./$types";
  import type { EventObject } from "$lib/types";
  import Event from "../Event.svelte";

  let { data }: { data: PageData } = $props();
  const event: EventObject = $state(data.event[0] as EventObject);
</script>

<svelte:head>
  <title>{event ? event.title : "Vilnius Hardcore"}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <Event {...event} detailed={true} />
</section>
