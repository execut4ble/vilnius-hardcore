<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { m } from "$lib/paraglide/messages.js";

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
    type="button"
    class="post action"
    onclick={() => (confirmDelete = true)}
  >
    <Fa icon={faTrash} /> {m.delete()}</button
  >
  {#if confirmDelete}
    <div class="confirm">
      <strong>{m.delete_confirm()}</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmDelete = false)}>{m.no()}</button
      >
      <button class="post action" type="submit">{m.yes()}</button>
    </div>
  {/if}
</form>

<style>
  div.confirm {
    display: inline;
  }
</style>
