<script lang="ts">
  import { slide } from "svelte/transition";

  let { errors } = $props();
</script>

{#if errors}
  <div class="fieldError" transition:slide>
    {errors?.join("\r\n") ?? ""}
  </div>
{/if}

<style>
  div.fieldError {
    color: var(--color-text-2);
    margin-bottom: 1em;
    white-space: pre;
  }
</style>
