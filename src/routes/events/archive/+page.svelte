<script lang="ts">
  import type { PageProps } from "./$types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { Event, MetaTags } from "$lib/components";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ItemCount from "$lib/components/common/ItemCount.svelte";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { SvelteDate, SvelteURL } from "svelte/reactivity";
  import { ArrowDownFromLine, ChevronLeft } from "@lucide/svelte";
  import { resolve } from "$app/paths";

  let { data, form }: PageProps = $props();
  let events: Array<EventObject> = $derived(data.events);
  let today: Date = new SvelteDate();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  let pastEvents: Array<EventObject> = $derived(events.reverse());

  let displayedEvents: number | null = $derived(events.length);
  let totalEvents: number | null = $derived(data.meta[0].totalEvents);

  async function loadMore() {
    const newUrl = new SvelteURL(page.url);
    const newPage = (Number(pastEvents.length) + 5).toString();
    newUrl.searchParams.set("limit", newPage);
    goto(newUrl, { noScroll: true });
  }
</script>

<svelte:head>
  <MetaTags title={m.past_events()} />
</svelte:head>

<h1>{m.past_events()}</h1>

<a href={resolve("/events")}>
  <h2><strong><ChevronLeft /> {m.upcoming_events()}</strong></h2>
</a>

<ul class="item-list">
  {#each pastEvents as event (event.id)}
    <li transition:slide>
      <Event {...event} {form} />
    </li>
  {:else}
    <span transition:slide>{m.no_past_events()}</span>
  {/each}
</ul>

{#if displayedEvents < (totalEvents !== null ? totalEvents : 0)}
  <button class="post action" onclick={loadMore}
    ><ArrowDownFromLine /> {m.show_more()}</button
  >
{/if}

<ItemCount displayedItems={displayedEvents} totalItems={totalEvents} />
