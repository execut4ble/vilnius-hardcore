<script lang="ts">
  import { confetti } from "@neoconfetti/svelte";

  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
</script>

{#if month === 10 && day === 20}
  <div
    class="foreground-confetti"
    use:confetti={{
      destroyAfterDone: true,
      particleCount: 75,
      stageHeight: window.innerHeight,
      stageWidth: window.innerWidth,
    }}
  ></div>
  <div
    class="background-confetti"
    use:confetti={{
      destroyAfterDone: true,
      particleCount: 100,
      stageHeight: window.innerHeight,
      stageWidth: window.innerWidth,
    }}
  ></div>
{/if}

<style>
  div.background-confetti {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    pointer-events: none;
    z-index: -1;
  }

  div.foreground-confetti {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    pointer-events: none;
  }
</style>
