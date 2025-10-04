<script lang="ts">
  import { enhance } from "$app/forms";
  import { FieldError } from "$lib/components";
  import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { DateInput } from "date-picker-svelte";
  import { SvelteDate } from "svelte/reactivity";

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
  let newEventDate: Date | null = $state(null);
  let confirmCancel: boolean = $state(false);
  let eventDate: Date = $derived(new SvelteDate(event.date));
  let dateToSave: Date | null = $derived(
    formAction === "?/update_event" ? eventDate : newEventDate,
  );
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
  <DateInput
    id="date"
    bind:value={dateToSave}
    timePrecision="minute"
    format="yyyy-MM-dd HH:mm"
    min={new SvelteDate("2007-11-20")}
    max={new SvelteDate("2099-12-31")}
    placeholder={new SvelteDate().toLocaleString("lt-LT", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
    required
  />
  <input type="hidden" name="date" value={dateToSave} />
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
      if (!newEventTitle && !newEventDescription) {
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
          newEventDate = null;
          newEventDescription = "";
          confirmCancel = false;
        }}>{m.yes()}</button
      >
    </div>
  {/if}
</form>
