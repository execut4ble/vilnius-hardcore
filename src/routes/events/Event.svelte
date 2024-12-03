<script lang="ts">
  import type { VenueEvent } from "$lib/types";
  import Fa from "svelte-fa";
  import { faPenToSquare, faSave } from "@fortawesome/free-solid-svg-icons";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  const event: VenueEvent = $props();

  const date: Date = new Date(event.date);
  const year: Number = date.getUTCFullYear();
  const month: String = date.toLocaleString("en-us", { month: "short" });
  const day: Number = date.getUTCDate();

  let title = $state(event.title ? event.title : "");
  let description = $state(event.description);
  let isEditing = $state(false);

  function handleToggleEdit(value: boolean) {
    isEditing = value;
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
            use:enhance={({ formData }) => {
              // Also include description
              // TODO: date
              formData.append("description", description ? description : "");
              isEditing = false;
              return async ({ result }) => {
                // Update slug param on the client
                const newSlug = result.data[0].slug; // TODO: Fix types
                goto(newSlug, { noScroll: true });
              };
            }}
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
      <hr />
      <div class="eventBody">
        {#if event.detailed && isEditing}
          <form
            method="POST"
            action="?/update_event"
            autocomplete="off"
            use:enhance={({ formData }) => {
              formData.append("title", title);
              isEditing = false;
            }}
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
