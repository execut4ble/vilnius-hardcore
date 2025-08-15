<script lang="ts">
  let { displayedItems, totalItems } = $props();
  import { m } from "$lib/paraglide/messages.js";
</script>

<div class="itemCount">
  {m.showing({ showCount: displayedItems, totalCount: totalItems })}
</div>

<style>
  div.itemCount {
    margin: 2em;
    display: flex;
    justify-content: center;
    color: var(--color-text-3);
  }
</style>
