<script lang="ts">
  import type { PageData } from "./$types";
  import Event from "../Event.svelte";

  let { data }: { data: PageData } = $props();
  const event: {
    date: Date;
    title: String;
    slug: String;
    description: String;
  } = $state(data.event[0]);
</script>

<svelte:head>
  <title>{event.title}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <Event {...event} />
</section>
