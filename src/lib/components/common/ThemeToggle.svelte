<script lang="ts">
  import { scale } from "svelte/transition";
  import { TrackAppearance } from "$lib/components";
  import { theme } from "$lib/stores/theme";

  import { SprayCan, SquareTerminal, Gamepad2 } from "@lucide/svelte";

  function cycleTheme() {
    if ($theme === "light") {
      theme.set("dark");
    } else if ($theme === "dark") {
      theme.set("greensteam");
    } else {
      theme.set("light");
    }
  }
</script>

<TrackAppearance />

<button
  class:isHackerMode={$theme === "dark"}
  class:isGreenSteam={$theme === "greensteam"}
  in:scale
  onclick={cycleTheme}
>
  {#if $theme === "dark"}
    <Gamepad2 />
  {:else if $theme === "greensteam"}
    <SprayCan />
  {:else if $theme === "light"}
    <SquareTerminal />
  {/if}
</button>
