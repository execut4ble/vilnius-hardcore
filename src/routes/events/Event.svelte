<script lang="ts">
  import type { VenueEvent } from "$lib/types";

  const event: VenueEvent = $props();

  const date: Date = new Date(event.date);

  const year: Number = date.getUTCFullYear();
  const month: String = date.toLocaleString("en-us", { month: "short" });
  const day: Number = date.getUTCDate();
</script>

<div class="event">
  {#if event.detailed && event.image}
    <img src={event.image} alt={event.title} />
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
        <h2>
          <a href="/events/{event.slug}"><strong>{event.title}</strong></a>
        </h2>
        <p>{date.toUTCString()}</p>
      </div>
      <div class="eventBody">
        {event.description}
      </div>
    </div>
    {#if !event.detailed && event.image}
      <img class="preview" src={event.image} alt={event.title} />
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

  div.eventRow .date {
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
</style>
