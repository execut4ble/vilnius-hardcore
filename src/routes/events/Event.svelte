<script lang="ts">
  const event: {
    date: Date;
    title: String;
    slug: String;
    description: String;
  } = $props();

  const date: Date = new Date(event.date);

  const year: Number = date.getUTCFullYear();
  const month: String = date.toLocaleString("en-us", { month: "short" });
  const day: Number = date.getUTCDate();
</script>

<div class="event">
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
      <h2><a href="/events/{event.slug}"><strong>{event.title}</strong></a></h2>
      <p>{date.toUTCString()}</p>
    </div>
    <div class="eventBody">
      {event.description}
    </div>
  </div>
</div>

<style>
  div.event {
    display: flex;
    flex-direction: row;
    gap: 1em;
    margin-bottom: 2em;
  }

  div.event .date {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0.5em;
    max-width: 2.5em;
    margin: 1em;
  }

  div.event .date .day {
    font-size: 20pt;
  }

  div.event .date .month {
    text-transform: uppercase;
  }

  .eventBody {
    white-space: pre-line;
  }
</style>
