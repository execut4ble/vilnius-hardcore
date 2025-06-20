<script lang="ts">
  let { errors } = $props();
  console.log(errors);
</script>

{#if errors}
  <div class="fieldError">
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
