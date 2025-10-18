<script lang="ts">
  let { displayedItems, totalItems } = $props();
  import { m } from "$lib/paraglide/messages.js";
</script>

<div id="item-total" class="center-block">
  {m.showing({ showCount: displayedItems, totalCount: totalItems })}
</div>

<style>
  div#item-total {
    color: var(--color-text-3);
  }
</style>
