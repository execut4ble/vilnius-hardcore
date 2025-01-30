<script>
  import { faPaintRoller, faTerminal } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  let hackerMode = false;
  function toggle() {
    hackerMode = !hackerMode;
    window.document.body.classList.toggle("hacker");
  }
</script>

<button on:click={toggle}>
  {#if hackerMode}
    <Fa icon={faPaintRoller} />
  {:else}
    <Fa icon={faTerminal} />
  {/if}
</button>

<style>
</style>
