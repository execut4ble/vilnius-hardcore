<script lang="ts">
  import type { PageProps } from "./$types";
  import type { Event as EventObject } from "$lib/server/db/schema";
  import { faAdd, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { enhance } from "$app/forms";
  import { Event, FieldError, ImageUploadForm } from "$lib/components";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import ItemCount from "$lib/components/common/ItemCount.svelte";

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
  let newEventDescription: string = $state("");
  let newEventTitle: string = $state("");
  let newEventDate: string = $state("");
  let confirmCancel: boolean = $state(false);

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
  <title>Events</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<h1>Events</h1>
{#if data.user}
  {#if !entryMode}
    <button type="button" class="post action" onclick={() => (entryMode = true)}
      ><Fa icon={faAdd} /> add new</button
    >
  {:else}
    <h2><strong>Add new event</strong></h2>
    <div class="formRow">
      <form
        class="newEvent"
        method="POST"
        action="?/create_event"
        autocomplete="off"
        use:enhance={createEvent}
      >
        <label for="title">Title</label>
        <input id="title" name="title" bind:value={newEventTitle} required />
        <FieldError errors={form?.errors?.title} />
        <label for="date">Date</label>
        <input
          id="date"
          type="datetime-local"
          name="date"
          bind:value={newEventDate}
          required
        />
        <FieldError errors={form?.errors?.date} />
        <input
          type="hidden"
          id="image"
          name="image"
          bind:value={displayImage}
        />
        <hr class="dim" />
        <label id="description" for="description">Description</label>
        <textarea
          name="description"
          spellcheck="false"
          bind:value={newEventDescription}
        ></textarea>
        <br />
        <button type="submit" class="post action"
          ><Fa icon={faSave} /> save</button
        >
        <button
          type="button"
          class="post action"
          onclick={() => {
            if (!newEventTitle && !newEventDate && !newEventDescription) {
              entryMode = false;
              confirmCancel = false;
            } else {
              confirmCancel = true;
            }
          }}><Fa icon={faXmark} /> cancel</button
        >
        {#if confirmCancel}<br /><br />
          <strong>really cancel?</strong>
          <button
            class="post action"
            type="button"
            onclick={() => (confirmCancel = false)}>no!</button
          >
          <button
            class="post action"
            onclick={() => {
              entryMode = false;
              newEventTitle = "";
              newEventDate = "";
              newEventDescription = "";
              confirmCancel = false;
            }}>yes!</button
          >
        {/if}
      </form>
      <div>
        <ImageUploadForm bind:selectedImage bind:displayImage />

        {#if displayImage}
          <div>
            <img
              class="previewImg"
              src={displayImage ? `${base}/public/uploads/${displayImage}` : ""}
              alt="New event"
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
<h2><strong>Upcoming events</strong></h2>
<ul class="eventList">
  {#each upcomingEvents as event (event.slug)}
    <li>
      <Event {...event} {form} />
    </li>
  {:else}
    <p>We have no upcoming events right now! Check back later!</p>
  {/each}
</ul>

<h2><strong>Past events</strong></h2>
<ul class="eventList">
  {#each pastEvents as event (event.slug)}
    <li>
      <Event {...event} {form} />
    </li>
  {:else}
    <p>No past events found.</p>
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

  form textarea[name="description"] {
    max-width: 25em;
  }
</style>
