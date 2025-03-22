<script lang="ts">
  let { errors } = $props();
</script>

<div class="fieldError">
  {errors?.join("\r\n") ?? ""}
</div>

<style>
  div.fieldError {
    color: var(--color-text-2);
    margin-bottom: 1em;
    white-space: pre;
  }
</style>
