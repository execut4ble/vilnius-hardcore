<script lang="ts">
  import type { VenueEvent } from "$lib/types";
  import Fa from "svelte-fa";
  import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  const event: VenueEvent = $props();

  let slug = $page.params.slug;

  const date: Date = new Date(event.date);
  const year: Number = date.getUTCFullYear();
  const month: String = date.toLocaleString("en-us", { month: "short" });
  const day: Number = date.getUTCDate();

  let title = $state(event.title);
  let description = $state(event.description);
  let isEditing = $state(false);

  function handleToggleEdit(value: boolean) {
    isEditing = value;
  }

  function updateEvent({ formData }: { formData: FormData }) {
    // Check if title was updated, then append it
    if (title !== event.title) {
      formData.append("title", title);
    }
    // Check if description was updated, then append it
    if (description !== event.description) {
      formData.append("description", description);
    }

    isEditing = false;

    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        const newSlug = result.data[0].slug;
        // Only go to new slug if our title has changed
        if (slug !== newSlug) {
          console.log("Redirecting to", newSlug);
          slug = newSlug;
          goto(newSlug, { noScroll: true });
        }
      } else if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }
</script>

<div class="event">
  {#if event.detailed && event.image}
    <img src={event.image} alt={title} />
  {/if}
  <div class="eventRow">
    <div class="date">
      <div class="month">
        {month}
      </div>
      <div class="day">
        <strong>{day}</strong>
      </div>
      <div class="year">
        {year}
      </div>
    </div>
    <div class="eventInfo">
      <div class="title">
        {#if event.detailed && isEditing}
          <form
            method="POST"
            action="?/update_event"
            autocomplete="off"
            use:enhance={updateEvent}
          >
            <input name="title" bind:value={title} required />
            {#if event.detailed && isEditing}
              <br />
              <button type="submit" class="post action"
                ><Fa icon={faSave} /> save</button
              >
            {/if}
          </form>
        {:else}
          <h2>
            <a href="/events/{event.slug}"
              ><strong>{title ? title : ""}</strong></a
            >
          </h2>
          {#if event.detailed}
            <button class="post action" onclick={() => handleToggleEdit(true)}
              ><Fa icon={faPenToSquare} /> edit</button
            >
          {/if}
        {/if}
        <p class="date">{date.toUTCString()}</p>
      </div>
      <hr class="dim" />
      <div class="eventBody">
        {#if event.detailed && isEditing}
          <form
            method="POST"
            action="?/update_event"
            autocomplete="off"
            use:enhance={updateEvent}
          >
            <textarea
              name="description"
              bind:value={description}
              spellcheck="false"
            ></textarea>
            {#if event.detailed && isEditing}
              <br />
              <button type="submit" class="post action"
                ><Fa icon={faSave} /> save</button
              >
            {/if}
          </form>
        {:else}
          <p class="description">
            {description}
          </p>
        {/if}
      </div>
    </div>
    {#if !event.detailed && event.image}
      <img class="preview" src={event.image} alt={title} />
    {/if}
  </div>
</div>

<style>
  div.eventRow {
    display: flex;
    flex-direction: row;
    gap: 1em;
    margin-bottom: 2em;
  }

  div.eventRow div.date {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0.5em;
    max-width: 2.5em;
    margin: 1em;
  }

  div.eventRow .date .day {
    font-size: 20pt;
  }

  div.eventRow .date .month {
    text-transform: uppercase;
  }

  div.event img {
    width: 100%;
    border-radius: 10px;
  }

  div.event img.preview {
    width: 12em;
    border-radius: 10px;
    height: fit-content;
  }

  div.eventInfo {
    flex-grow: 1;
  }

  .eventBody {
    white-space: pre-line;
  }

  div.eventInfo .title form input {
    margin-top: 0.83em;
    margin-bottom: 0.5em;
    background-color: #1c1c1c;
    border: none;
    color: #0c0;
    font-weight: 400;
    font-size: 1rem;
    padding: 12px 10px;
  }

  div.eventInfo .title form input:focus {
    border: 1px solid #0c0;
    outline: none;
  }

  div.eventBody form textarea {
    margin-top: 0.83em;
    margin-bottom: 0.5em;
    background-color: #1c1c1c;
    border: none;
    color: #0c0;
    font-weight: 400;
    font-size: 1rem;
    padding: 12px 10px;
    width: 70%;
    height: 15rem;
  }

  div.eventBody form textarea:focus {
    border: 1px solid #0c0;
    outline: none;
  }

  div.eventRow p.date {
    margin-bottom: 0;
  }
</style>
