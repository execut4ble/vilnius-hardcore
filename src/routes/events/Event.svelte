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
  import ImageUploadForm from "./ImageUploadForm.svelte";

  let {
    detailed = false,
    events = $bindable(),
    ...event
  }: EventComponent = $props();

  let title = $state(event.title);
  let description = $state(event.description);
  let md = $derived(description);
  let slug = $state(event.slug);
  let isEditing: boolean = $state(false);
  let originalImage: string | null = $state(event.image);
  let imageFilename: string | null = $state(event.image);
  let selectedImage: string | null | undefined = $state();

  let confirmDelete: boolean = $state(false);
  let date: string = $state(new Date(event.date).toLocaleString("lt-LT"));
  const year: number = $derived(new Date(date).getFullYear());
  const month: string = $derived(
    new Date(date).toLocaleString("en-us", { month: "short" }),
  );
  const day: number = $derived(new Date(date).getDate());

  function updateEvent({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        isEditing = false;
        const newSlug = result.data[0].slug;
        // Only go to new slug if our title has changed
        // and we're in the detail events page
        if (
          slug !== newSlug &&
          page.route.id &&
          page.route.id.includes("[slug]")
        ) {
          console.log("Redirecting to", newSlug);
          goto(newSlug, { noScroll: true });
        }
        slug = newSlug;
        originalImage = imageFilename;
        selectedImage = null;
      } else if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
      }
    };
  }

  function removeEvent() {
    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        if (detailed) {
          goto("/events", { noScroll: true });
        } else {
          if (events) {
            events = events.filter((item) => item.slug !== slug);
          }
        }
      } else if (result.type === "error") {
        // Handle errors if necessary
        console.error("Delete failed:", result.status);
      }
    };
  }
</script>

<div class="event">
  {#if detailed && imageFilename}
    <img
      class="img"
      src={imageFilename ? `${base}/public/uploads/${imageFilename}` : ""}
      alt={title}
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
    <div class="eventInfo">
      <div class="title">
        {#if !isEditing}
          <h2>
            <a href="/events/{slug}"><strong>{title ? title : ""}</strong></a>
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
          <p class="date">
            {new Date(date).toLocaleTimeString("lt-LT", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
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
            <input id="title" name="title" bind:value={title} required />
            <label for="date">Date</label>
            <input
              id="date"
              type="datetime-local"
              name="date"
              bind:value={date}
              required
            />
            <input
              type="hidden"
              id="image"
              name="image"
              bind:value={imageFilename}
            />
            <hr class="dim" />
            <label id="description" for="description">Description</label>
            <textarea
              name="description"
              bind:value={description}
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
                imageFilename = originalImage;
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
        <ImageUploadForm bind:selectedImage bind:imageFilename {slug} />
      {/if}
      {#if !detailed && imageFilename}
        <img
          class="previewImg"
          src={imageFilename ? `${base}/public/uploads/${imageFilename}` : ""}
          alt={title}
        />
      {/if}
    </div>
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
    margin: 0.5em 1em 0.5em 1em;
  }

  div.eventRow .date .day {
    font-size: 20pt;
  }

  div.eventRow .date .month {
    text-transform: uppercase;
  }

  div.event .img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 1em;
  }

  div.event .previewImg {
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

  div.eventRow p.date {
    margin-bottom: 0;
  }

  div.title h2 {
    margin-bottom: 0.25em;
  }

  div.title form {
    margin-bottom: 0;
  }
</style>
