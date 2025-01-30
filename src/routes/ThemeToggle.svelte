<script>
  let hackerMode = false;
  function toggle() {
    hackerMode = !hackerMode;
    window.document.body.classList.toggle("hacker");
  }
</script>

<button on:click={toggle}>
  {#if hackerMode}
    Go normal
  {:else}
    Go 1337
  {/if}
</button>

<style>
</style>
