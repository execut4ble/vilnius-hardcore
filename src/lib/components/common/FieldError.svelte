<script lang="ts">
  import { slide } from "#lib/transition.js";

  let { errors } = $props();
</script>

{#if errors}
  <div class="field-error" transition:slide>
    {errors?.join("\r\n") ?? ""}
  </div>
{/if}

<style>
  div.field-error {
    color: var(--color-text-2);
    margin-bottom: 1em;
    white-space: pre;
  }
</style>
