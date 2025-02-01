<script>
  import { faPaintRoller, faTerminal } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { appearance } from "@friendofsvelte/toggle";
  import { scale } from "svelte/transition";
  import TrackAppearance from "$lib/TrackAppearance.svelte";
</script>

<TrackAppearance />
{#if appearance.dark !== null}
  <button
    class:isDarkMode={appearance.dark}
    in:scale
    onclick={() => (appearance.dark = !appearance.dark)}
  >
    {#if appearance.dark}
      <Fa icon={faPaintRoller} />
    {:else}
      <Fa icon={faTerminal} />
    {/if}
  </button>
{:else}{/if}
