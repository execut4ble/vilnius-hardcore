<script lang="ts">
  import { enhance } from "$app/forms";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";
  import { m } from "$lib/paraglide/messages.js";
  import { SvelteDate } from "svelte/reactivity";

  let { ...ban } = $props();
  let date: SvelteDate = $derived(new SvelteDate(ban.date));
  let confirmDelete: boolean = $state(false);
</script>

<div class="banned-ip" transition:slide>
  <strong>{ban.ipAddress}</strong> ({m.blocked_on()}
  {date.toLocaleString("lt-LT")})
  <form class="remove-ban" method="POST" action="?/remove_ip" use:enhance>
    <input type="hidden" name="id" value={ban.id} />
    <button
      type="button"
      class="post action"
      onclick={() => (confirmDelete = true)}
    >
      <Fa icon={faTrash} /></button
    >
    {#if confirmDelete}
      <strong>{m.delete()}?</strong>
      <button
        class="post action"
        type="button"
        onclick={() => (confirmDelete = false)}>{m.no()}</button
      >
      <button class="post action" type="submit">{m.yes()}</button>
    {/if}
  </form>
</div>

<style>
  form.remove-ban {
    display: inline;
    margin-bottom: none;
  }
</style>
