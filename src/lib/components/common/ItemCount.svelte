<script lang="ts">
  let { displayedItems, totalItems } = $props();
</script>

<div class="itemCount">Showing {displayedItems} out of {totalItems}</div>

<style>
  div.itemCount {
    margin: 2em;
    display: flex;
    justify-content: center;
    color: var(--color-text-3);
  }
</style>
