<script>
  import { appearance } from "@friendofsvelte/toggle";
  import { scale } from "svelte/transition";
  import { TrackAppearance } from "$lib/components";
  import { SprayCan, SquareTerminal } from "@lucide/svelte";
</script>

<TrackAppearance />
{#if appearance.dark !== null}
  <button
    class:isHackerMode={appearance.dark}
    in:scale
    onclick={() => (appearance.dark = !appearance.dark)}
  >
    {#if appearance.dark}
      <SprayCan />
    {:else}
      <SquareTerminal />
    {/if}
  </button>
{/if}
