<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

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
    <Fa icon={faTrash} /> delete</button
  >
  {#if confirmDelete}
    <div class="confirm">
      <strong>for real?</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmDelete = false)}>no!</button
      >
      <button class="post action" type="submit">yes!</button>
    </div>
  {/if}
</form>

<style>
  div.confirm {
    display: inline;
  }
</style>
