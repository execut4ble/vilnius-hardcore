<script lang="ts">
  import Fa from "svelte-fa";
  import { faPenToSquare, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { EventComponent } from "$lib/types";
  import { base } from "$app/paths";
  import Markdown from "svelte-exmarkdown";
  import ImageUploadForm from "$lib/components/events/ImageUploadForm.svelte";
  import { RemoveItemForm, EventEntryForm } from "$lib/components";
  import { blur } from "svelte/transition";
  import CommentCount from "../common/CommentCount.svelte";
  import { m } from "$lib/paraglide/messages.js";

  let { detailed = false, form, ...event }: EventComponent = $props();

  let md = $derived(event.description);
  let slug = $derived(event.slug);
  let isEditing: boolean = $state(false);
  let imageFilename: string | null = $derived(event.image);
  let selectedImage: string | null | undefined = $state();
  let isVisible: boolean = $derived(event.is_visible);

  let date: string = $derived(
    new Date(event.date).toLocaleString("lt-LT", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  );
  const year: number = $derived(new Date(event.date).getFullYear());
  const month: string = $derived(
    new Date(event.date).toLocaleString("en-us", { month: "short" }),
  );
  const day: number = $derived(new Date(event.date).getDate());

  function updateEvent({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.type === "success") {
        if (page.params.slug && result?.data[0]?.slug !== slug) {
          goto(result.data[0].slug, { noScroll: true, invalidateAll: true });
          isEditing = false;
        } else {
          await update({ reset: false }).then(() => {
            isEditing = false;
          });
        }
      }

      if (result.type === "failure") {
        await update({ reset: false }); // Update to throw form errors
      }

      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Form submission failed:", result.status);
        await update({ reset: false }); // Update to throw form errors
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
        {#if !isVisible}
          <div class="font-size-small dim draft">
            <Fa icon={faEyeSlash}></Fa>
            {m.draft()}
          </div>
        {/if}
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
              <div class="actions">
                <button class="post action" onclick={() => (isEditing = true)}
                  ><Fa icon={faPenToSquare} /> {m.edit()}</button
                >
                <RemoveItemForm {slug} action="?/remove_event" />
              </div>
            {/if}
            <div class="meta">
              <p class="date">
                {date}
              </p>
              {#if !detailed}
                <CommentCount
                  taxonomy="events"
                  {slug}
                  commentCount={event.comments}
                />
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
            <EventEntryForm
              {form}
              formAction="?/update_event"
              enhanceFunction={updateEvent}
              bind:entryMode={isEditing}
              bind:displayImage={imageFilename}
              bind:selectedImage
              {...event}
            />
          {/if}
        </div>
      </div>
      <div>
        {#if isEditing}
          <ImageUploadForm
            bind:selectedImage
            bind:displayImage={imageFilename}
            {slug}
          />
        {/if}
        {#if !detailed && event.image}
          {#if imageFilename}
            <img
              class="previewImg"
              src={imageFilename ? `${base}/images/${imageFilename}` : ""}
              alt={event.title}
              transition:blur
            />
          {/if}
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

  div.title h2 {
    margin-bottom: 0.25em;
  }

  div.draft {
    text-transform: uppercase;
  }
</style>
