<script lang="ts">
  import type { PageProps } from "./$types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { faAdd } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import {
    Event,
    EventEntryForm,
    ImageUploadForm,
    MetaTags,
  } from "$lib/components";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ItemCount from "$lib/components/common/ItemCount.svelte";
  import { blur, slide } from "svelte/transition";

  let { data, form }: PageProps = $props();
  let events: Array<EventObject> = $derived(data.events);
  let today: Date = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  let upcomingEvents: Array<EventObject> = $derived(
    events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  );

  let pastEvents: Array<EventObject> = $derived(
    events
      .filter((event) => new Date(event.date) < today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reverse(),
  );

  let entryMode: boolean = $state(false);
  let displayImage: string | undefined = $state();
  let selectedImage: string | undefined = $state();
  let displayedEvents: number | null = $derived(events.length);
  let totalEvents: number | null = $derived(data.meta[0].totalEvents);

  function createEvent() {
    return async ({ update, result }) => {
      await update();
      if (result.type === "success") {
        entryMode = false;
      }
      if (result.type === "error") {
        console.error("Form submission failed:", result.status);
      }
    };
  }

  async function loadMore() {
    const newUrl = new URL(page.url);
    const newPage = (Number(pastEvents.length) + 5).toString();
    newUrl.searchParams.set("limit", newPage);
    goto(newUrl, { noScroll: true });
  }
</script>

<svelte:head>
  <MetaTags title="Events" />
</svelte:head>

<h1>Events</h1>
{#if data.user}
  {#if !entryMode}
    <button
      type="button"
      class="post action new-event"
      onclick={() => (entryMode = true)}><Fa icon={faAdd} /> add new</button
    >
  {:else}
    <div transition:slide class="event-entry-form">
      <h2><strong>Add new event</strong></h2>
      <div class="formRow">
        <EventEntryForm
          {form}
          formAction="?/create_event"
          enhanceFunction={createEvent}
          bind:entryMode
          {displayImage}
        />
        <div>
          <ImageUploadForm bind:selectedImage bind:displayImage />

          {#if displayImage}
            <div>
              <img
                class="previewImg"
                src={displayImage ? `${base}/images/${displayImage}` : ""}
                alt="New event"
                transition:blur
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
{/if}
<h2><strong>Upcoming events</strong></h2>
<ul class="eventList">
  {#each upcomingEvents as event (event.id)}
    <li transition:slide>
      <Event {...event} {form} />
    </li>
  {:else}
    <p transition:slide>
      We have no upcoming events right now! Check back later!
    </p>
  {/each}
</ul>

<h2><strong>Past events</strong></h2>
<ul class="eventList">
  {#each pastEvents as event (event.id)}
    <li transition:slide>
      <Event {...event} {form} />
    </li>
  {:else}
    <p transition:slide>No past events found.</p>
  {/each}
</ul>

{#if displayedEvents < (totalEvents !== null ? totalEvents : 0)}
  <button class="post action" onclick={loadMore}>show more</button>
{/if}

<ItemCount displayedItems={displayedEvents} totalItems={totalEvents} />

<style>
  ul.eventList {
    padding-left: 0;
  }

  ul.eventList li {
    list-style: none;
  }

  div.formRow {
    display: flex;
    flex-direction: row;
    gap: 2em;
  }

  div .previewImg {
    width: 12em;
    border-radius: 10px;
    height: fit-content;
  }
</style>
