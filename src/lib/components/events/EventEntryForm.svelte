<script lang="ts">
  import { enhance } from "$app/forms";
  import { FieldError } from "$lib/components";
  import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";

  let {
    form,
    formAction,
    enhanceFunction,
    entryMode = $bindable(),
    displayImage = $bindable(),
    selectedImage = $bindable(),
    ...event
  } = $props();

  let newEventDescription: string = $state("");
  let newEventTitle: string = $state("");
  let newEventDate: string = $state("");
  let confirmCancel: boolean = $state(false);
</script>

<form
  class="newEvent"
  method="POST"
  action={formAction}
  autocomplete="off"
  use:enhance={enhanceFunction}
>
  <label for="title">{m["form.title"]()}</label>
  {#if event.title}
    <input id="title" name="title" value={event.title} required />
  {:else}
    <input id="title" name="title" bind:value={newEventTitle} required />
  {/if}
  <FieldError errors={form?.errors?.title} />
  <label for="date">{m["form.date"]()}</label>
  {#if event.date}
    <input
      id="date"
      type="datetime-local"
      name="date"
      value={event.date}
      required
    />
  {:else}
    <input
      id="date"
      type="datetime-local"
      name="date"
      bind:value={newEventDate}
      required
    />
  {/if}
  <FieldError errors={form?.errors?.date} />
  {#if event.image}
    <input
      type="hidden"
      id="image"
      name="image"
      value={selectedImage !== undefined ? selectedImage : displayImage}
    />
  {:else}
    <input type="hidden" id="image" name="image" bind:value={displayImage} />
  {/if}
  <hr class="dim" />
  <label id="description" for="description">{m["form.description"]()}</label>
  {#if event.description}
    <textarea
      id="description"
      name="description"
      spellcheck="false"
      value={event.description}
    ></textarea>
  {:else}
    <textarea
      id="description"
      name="description"
      spellcheck="false"
      bind:value={newEventDescription}
    ></textarea>
  {/if}
  <br />
  <label for="is_visible"
    ><input
      type="checkbox"
      id="is_visible"
      name="is_visible"
      checked={event.is_visible}
    />
    {m["form.publish_event"]()}</label
  >
  <br />
  <button type="submit" class="post action"
    ><Fa icon={faSave} /> {m.save()}</button
  >
  <button
    type="button"
    class="post action"
    onclick={() => {
      if (!newEventTitle && !newEventDate && !newEventDescription) {
        entryMode = false;
        confirmCancel = false;
        selectedImage = undefined;
        displayImage = event.image;
      } else {
        confirmCancel = true;
      }
    }}><Fa icon={faXmark} /> {m.cancel()}</button
  >
  {#if confirmCancel}<br /><br />
    <div transition:slide>
      <strong>{m.cancel_confirm()}</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmCancel = false)}>{m.no()}</button
      >
      <button
        class="post action"
        type="button"
        onclick={() => {
          entryMode = false;
          newEventTitle = "";
          newEventDate = "";
          newEventDescription = "";
          confirmCancel = false;
        }}>{m.yes()}</button
      >
    </div>
  {/if}
</form>

<style>
  form textarea[name="description"] {
    max-width: 25em;
  }
</style>
