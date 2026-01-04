<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faPenToSquare,
    faEyeSlash,
    faLink,
  } from "@fortawesome/free-solid-svg-icons";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { EventComponent } from "$lib/types";
  import Markdown from "svelte-exmarkdown";
  import {
    RemoveItemForm,
    EventEntryForm,
    ImageUploadForm,
    CommentCount,
  } from "$lib/components";
  import { blur } from "svelte/transition";
  import { getLocale } from "$lib/paraglide/runtime";
  import { SvelteDate, SvelteURL } from "svelte/reactivity";
  import { resolve } from "$app/paths";
  import { m } from "$lib/paraglide/messages";

  let { detailed = false, form, ...event }: EventComponent = $props();

  let md = $derived(event.description);
  let slug = $derived(event.slug);
  let isEditing: boolean = $state(false);
  let imageFilename: string | null = $derived(event.image);
  let selectedImage: string | null | undefined = $state();
  let isVisible: boolean = $derived(event.is_visible);
  let locale: string = $derived(getLocale());
  let externalUrl: string | null = $derived(event.external_url);

  let date: Date = $derived(new SvelteDate(event.date));
  const year: number = $derived(new SvelteDate(event.date).getFullYear());
  const month: string = $derived(
    new SvelteDate(event.date).toLocaleString(locale, {
      month: locale === "lt" ? "long" : "short",
    }),
  );
  const day: number = $derived(new SvelteDate(event.date).getDate());

  function updateEvent({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.type === "success") {
        if (page.params.slug && result?.data[0]?.slug !== slug) {
          goto(resolve("/events/[slug]", { slug: result.data[0].slug }), {
            noScroll: true,
            invalidateAll: true,
          });
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
  {#if detailed && imageFilename}
    <img
      class="detailed"
      src={imageFilename ? `/images/${imageFilename}` : ""}
      alt={event.title}
    />
  {/if}
  <div class="event-row">
    <div class="date">
      <span class="month">
        {month}
      </span>
      <span class="day">
        <strong>{day}</strong>
      </span>
      <span class="year">
        {year}
      </span>
    </div>
    <div class="event-block">
      <div class="event-heading">
        {#if !isVisible}
          <div class="font-size-small dim draft">
            <Fa icon={faEyeSlash} />
            {m.draft()}
          </div>
        {/if}
        {#if !isEditing}
          <h2 class="title">
            {#if detailed}
              <strong>{event.title ? event.title : ""}</strong>
            {:else}
              <a href={resolve("/events/[slug]", { slug: slug as string })}
                ><strong>{event.title ? event.title : ""}</strong></a
              >{/if}
          </h2>
          {#if page.url.pathname !== "/" && page.data.user}
            <div class="actions">
              <button
                id="edit"
                class="post action"
                onclick={() => (isEditing = true)}
                ><Fa icon={faPenToSquare} /> {m.edit()}</button
              >
              <RemoveItemForm {slug} action="?/remove_event" />
            </div>
          {/if}
          <div class="meta-info">
            <span class="date">
              {date.toLocaleString("lt-LT", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {#if page.data.globalCommentsEnabled}
              {#if !detailed}
                <CommentCount
                  taxonomy="events"
                  {slug}
                  commentCount={event.comments}
                />
              {/if}
            {/if}
          </div>
          <hr class="dim" />
          <div class="event-body">
            <div class="event-description">
              {#if md}
                <Markdown {md} />
              {/if}
            </div>
            {#if externalUrl}
              <span class="external-url">
                <p>
                  <span class="icon"><Fa icon={faLink} /></span>
                  <a href={externalUrl} target="_blank"
                    ><strong>{new SvelteURL(externalUrl).hostname}</strong></a
                  >
                </p>
              </span>
            {/if}
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
      <div class="image-upload">
        {#if isEditing}
          <ImageUploadForm
            bind:selectedImage
            bind:displayImage={imageFilename}
            {slug}
          />
        {/if}
        {#if !detailed && imageFilename}
          <a href={resolve("/events/[slug]", { slug: event.slug as string })}
            ><img
              class="preview"
              src={imageFilename ? `/images/${imageFilename}` : ""}
              alt={event.title}
              transition:blur
            /></a
          >
        {/if}
      </div>
    </div>
  </div>
</event>

<style>
  div.event-row {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  @media screen and (max-width: 575px) {
    div.event-block {
      display: flex;
      flex-direction: column-reverse;
    }
  }

  @media screen and (min-width: 575px) {
    div.event-block {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
    }
  }

  div.event-row div.date {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 0.5em;
    max-width: 2.5em;
    margin: 0.5em 1em 0.5em 1em;
  }

  @media screen and (max-width: 850px) {
    div.event-row div.date {
      margin: 0.5em 0em 0.5em 0em;
    }
  }

  div.event-row div.date span.day {
    font-size: 20pt;
  }

  div.event-row div.date span.month {
    text-transform: uppercase;
  }

  event img.detailed {
    max-width: 100%;
    border-radius: 10px;
    margin-bottom: 1em;
    max-height: 65vh;
  }

  event img.preview {
    width: 12em;
    border-radius: 10px;
  }

  div.event-heading {
    flex-grow: 1;
  }

  div.event-body {
    white-space: pre-line;
  }

  div.draft {
    text-transform: uppercase;
  }

  span.external-url {
    color: var(--color-text-3);
    font-style: italic;
  }
</style>
