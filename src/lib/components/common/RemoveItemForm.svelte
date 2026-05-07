<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { m } from "$lib/paraglide/messages.js";
  import { Trash2 } from "@lucide/svelte";

  let { slug, action } = $props();
  let confirmDelete: boolean = $state(false);

  function removeItem() {
    return async ({ update, result }) => {
      if (page.params.slug === slug) {
        goto(page?.route?.id?.split("/[")[0] as string, {
          noScroll: true,
          invalidateAll: true,
        });
      } else {
        await update();
      }
      if (result.type === "error") {
        // Handle errors if necessary
        console.error("Delete failed:", result.status);
        await update({ reset: false }); // Update to throw form errors
      }
    };
  }
</script>

<form method="POST" {action} use:enhance={removeItem}>
  <input
    type="hidden"
    name="slug"
    value={page.params.slug ? page.params.slug : slug}
  />
  <button
    id="delete"
    type="button"
    class="post action"
    onclick={() => (confirmDelete = true)}
  >
    <Trash2 /> {m.delete()}</button
  >
  {#if confirmDelete}
    <span class="confirm-dialog">
      <strong>{m.delete_confirm()}</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmDelete = false)}>{m.no()}</button
      >
      <button class="post action" type="submit">{m.yes()}</button>
    </span>
  {/if}
</form>

<style>
  span.confirm-dialog {
    display: inline;
  }
</style>
