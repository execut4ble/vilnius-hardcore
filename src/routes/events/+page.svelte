<script lang="ts">
  import type { PageProps } from "./$types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import {
    faAdd,
    faCalendarAlt,
    faChevronDown,
    faRss,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import {
    CopyTextButton,
    Event,
    EventEntryForm,
    ImageUploadForm,
    MetaTags,
  } from "$lib/components";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ItemCount from "$lib/components/common/ItemCount.svelte";
  import { blur, slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { SvelteDate, SvelteURL } from "svelte/reactivity";

  let { data, form }: PageProps = $props();
  let events: Array<EventObject> = $derived(data.events);
  let today: Date = new SvelteDate();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  let upcomingEvents: Array<EventObject> = $derived(
    events
      .filter((event) => new SvelteDate(event.date) >= today)
      .sort(
        (a, b) =>
          new SvelteDate(a.date).getTime() - new SvelteDate(b.date).getTime(),
      ),
  );

  let pastEvents: Array<EventObject> = $derived(
    events
      .filter((event) => new SvelteDate(event.date) < today)
      .sort(
        (a, b) =>
          new SvelteDate(a.date).getTime() - new SvelteDate(b.date).getTime(),
      )
      .reverse(),
  );

  let entryMode: boolean = $state(false);
  let displayImage: string | undefined = $state();
  let selectedImage: string | undefined = $state();
  let displayedEvents: number | null = $derived(events.length);
  let totalEvents: number | null = $derived(data.meta[0].totalEvents);

  let iCalUrl: string = $state(page.url.origin + "/events/calendar.ics");
  let rssUrl: string = $state(page.url.origin + "/events/feed.rss");

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
    const newUrl = new SvelteURL(page.url);
    const newPage = (Number(pastEvents.length) + 5).toString();
    newUrl.searchParams.set("limit", newPage);
    goto(newUrl, { noScroll: true });
  }
</script>

<svelte:head>
  <MetaTags title="Events" />
</svelte:head>

<h1>{m["navigation.events"]()}</h1>

<div class="feed-links">
  <ul class="feed-items">
    <li>
      <CopyTextButton
        textToCopy={iCalUrl}
        buttonIcon={faCalendarAlt}
        buttonText="iCal"
      />
    </li>
    <li>
      <CopyTextButton textToCopy={rssUrl} buttonIcon={faRss} buttonText="RSS" />
    </li>
  </ul>
</div>

{#if data.user}
  {#if !entryMode}
    <button
      type="button"
      class="post action new-event"
      onclick={() => (entryMode = true)}
      ><Fa icon={faAdd} /> {m.add_new()}</button
    >
  {:else}
    <div transition:slide class="event-entry-form">
      <h2><strong>{m.add_new_event()}</strong></h2>
      <div class="form-row">
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
                class="preview"
                src={displayImage ? `/images/${displayImage}` : ""}
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
<h2><strong>{m.upcoming_events()}</strong></h2>
<ul class="item-list">
  {#each upcomingEvents as event (event.id)}
    <li transition:slide>
      <Event {...event} {form} />
    </li>
  {:else}
    <span transition:slide> {m["no_events.check_later"]()}</span>
  {/each}
</ul>

<h2><strong>{m.past_events()}</strong></h2>
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
    ><Fa icon={faChevronDown}></Fa> {m.show_more()}</button
  >
{/if}

<ItemCount displayedItems={displayedEvents} totalItems={totalEvents} />

<style>
  div.form-row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  @media screen and (max-width: 575px) {
    div.form-row {
      flex-direction: column-reverse;
    }

    ul.feed-items {
      display: flex;
      flex-direction: column;
      list-style: none;
      align-items: center;
      margin-top: 0;
      padding-left: 0;
    }
  }

  div img.preview {
    width: 12em;
    border-radius: 10px;
    height: fit-content;
  }

  @media screen and (min-width: 575px) {
    div.feed-links {
      position: relative;
    }

    ul.feed-items {
      position: absolute;
      width: fit-content;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25em;
      list-style: none;
      padding-left: 0;
      align-items: flex-end;
      margin-top: 0;
      top: -4rem;
    }
  }
</style>
