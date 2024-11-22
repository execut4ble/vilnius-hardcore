<script lang="ts">
  const event: {
    date: Date;
    title: String;
    slug: String;
    description: String;
  } = $props();

  const date: Date = new Date(event.date);

  const year: Number = date.getFullYear();
  const month: String = date.toLocaleString("en-us", { month: "short" });
  const day: Number = date.getDay();
</script>

<div class="event">
  <div class="eventHeading">
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
    <div class="title">
      <h2><a href="/events/{event.slug}"><strong>{event.title}</strong></a></h2>
      <p>{date.toUTCString()}</p>
    </div>
  </div>
  <div class="eventBody">
    {event.description}
  </div>
</div>

<style>
  div.eventHeading {
    display: flex;
    flex-direction: row;
    gap: 2em;
  }

  div.eventHeading .date {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    max-width: 2.5em;
  }

  div.eventHeading .date .day {
    font-size: 20pt;
  }

  .event .eventHeading .date .month {
    text-transform: uppercase;
  }

  .eventBody {
    white-space: pre-line;
  }
</style>
