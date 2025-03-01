<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faPenToSquare,
    faSave,
    faXmark,
    faTrash,
  } from "@fortawesome/free-solid-svg-icons";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { EventComponent } from "$lib/types";
  import { base } from "$app/paths";
  import Markdown from "svelte-exmarkdown";
  import ImageUploadForm from "$lib/components/events/ImageUploadForm.svelte";

  let { detailed = false, ...event }: EventComponent = $props();

  let md = $derived(event.description);
  let slug = $state(event.slug);
  let isEditing: boolean = $state(false);
  let imageFilename: string | null = $derived(event.image);
  let selectedImage: string | null | undefined = $state();
  let commentCount: number | null | undefined = $derived(event.comments);

  let confirmDelete: boolean = $state(false);
  let date: string = $derived(new Date(event.date).toLocaleString("lt-LT"));
  const year: number = $derived(new Date(date).getFullYear());
  const month: string = $derived(
    new Date(date).toLocaleString("en-us", { month: "short" }),
  );
  const day: number = $derived(new Date(date).getDate());

  function updateEvent({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.data && result.data[0].slug !== slug) {
        goto(result.data[0].slug, { noScroll: true });
        isEditing = false;
        slug = result.data[0].slug;
      } else {
        await update().then(() => {
          isEditing = false;
        });
      }

      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }

  function removeEvent() {
    return async ({ update, result }) => {
      if (detailed) {
        goto("/events", { noScroll: true });
      } else {
        await update();
      }
      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Delete failed:", result.status);
      }
    };
  }
</script>

<event>
  {#if detailed && event.image}
    <img
      class="img"
      src={event.image ? `${base}/images/${event.image}` : ""}
      alt={event.title}
    />
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
    <div class="eventDetails">
      <div class="eventInfo">
        <div class="title">
          {#if !isEditing}
            <h2>
              {#if detailed}
                <strong>{event.title ? event.title : ""}</strong>
              {:else}
                <a href="/events/{slug}"
                  ><strong>{event.title ? event.title : ""}</strong></a
                >{/if}
            </h2>
            {#if page.url.pathname !== "/" && page.data.user}
              <form
                method="POST"
                action="?/remove_event"
                use:enhance={removeEvent}
              >
                <input type="hidden" name="slug" value={slug} />
                <button class="post action" onclick={() => (isEditing = true)}
                  ><Fa icon={faPenToSquare} /> edit</button
                >
                <button
                  type="button"
                  class="post action"
                  onclick={() => (confirmDelete = true)}
                >
                  <Fa icon={faTrash} /> delete</button
                >
                {#if confirmDelete}<br /><br />
                  <strong>for real?</strong>
                  <button
                    class="post action"
                    type="button"
                    onclick={() => (confirmDelete = false)}>no!</button
                  >
                  <button class="post action" type="submit">yes!</button>
                {/if}
              </form>
            {/if}
            <div class="meta">
              <p class="date">
                {new Date(date).toLocaleTimeString("lt-LT", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {#if !detailed && commentCount && commentCount > 0}
                <p class="comments">
                  <a href="/events/{slug}#comments"
                    >{commentCount}
                    {#if commentCount < 2}
                      comment
                    {:else}
                      comments
                    {/if}
                  </a>
                </p>
              {/if}
            </div>
            <hr class="dim" />
            <div class="eventBody">
              <div class="description">
                {#if md}
                  <Markdown {md} />
                {/if}
              </div>
            </div>
          {:else}
            <form
              method="POST"
              action="?/update_event"
              autocomplete="off"
              use:enhance={updateEvent}
            >
              <label for="title">Title</label>
              <input id="title" name="title" value={event.title} required />
              <label for="date">Date</label>
              <input
                id="date"
                type="datetime-local"
                name="date"
                value={date}
                required
              />
              <input
                type="hidden"
                id="image"
                name="image"
                value={selectedImage ? selectedImage : imageFilename}
              />
              <hr class="dim" />
              <label id="description" for="description">Description</label>
              <textarea
                name="description"
                value={event.description}
                spellcheck="false"
              ></textarea>
              <br />
              <button type="submit" class="post action"
                ><Fa icon={faSave} /> save</button
              >
              <button
                type="button"
                class="post action"
                onclick={() => {
                  isEditing = false;
                  selectedImage = null;
                }}><Fa icon={faXmark} /> cancel</button
              >
            </form>
          {/if}
        </div>
      </div>
      <div>
        {#if isEditing}
          <ImageUploadForm
            bind:selectedImage
            displayImage={imageFilename}
            {slug}
          />
        {/if}
        {#if !detailed && event.image}
          <img
            class="previewImg"
            src={event.image ? `${base}/images/${event.image}` : ""}
            alt={event.title}
          />
        {/if}
      </div>
    </div>
  </div>
</event>

<style>
  div.eventRow {
    display: flex;
    flex-direction: row;
    gap: 1em;
    margin-bottom: 2em;
  }

  @media screen and (max-width: 530px) {
    div.eventDetails {
      display: flex;
      flex-direction: column-reverse;
    }
  }

  @media screen and (min-width: 530px) {
    div.eventDetails {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
    }
  }

  div.eventRow div.date {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0.5em;
    max-width: 2.5em;
    margin: 0.5em 1em 0.5em 1em;
  }

  div.eventRow .date .day {
    font-size: 20pt;
  }

  div.eventRow .date .month {
    text-transform: uppercase;
  }

  event .img {
    max-width: 100%;
    border-radius: 10px;
    margin-bottom: 1em;
    max-height: 65vh;
  }

  event .previewImg {
    width: 12em;
    border-radius: 10px;
  }

  div.eventInfo {
    flex-grow: 1;
  }

  .eventBody {
    white-space: pre-line;
  }

  div.eventRow p {
    margin-bottom: 0;
    margin-top: 0;
  }

  div.title h2 {
    margin-bottom: 0.25em;
  }

  div.title form {
    margin-bottom: 0.5em;
  }

  div.meta {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
  }

  event form textarea {
    max-width: 20em;
  }
</style>
