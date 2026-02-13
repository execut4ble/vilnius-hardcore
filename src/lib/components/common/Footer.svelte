<script lang="ts">
  import { resolve } from "$app/paths";
  import NowItFuckingCuts from "$lib/images/nowitfuckingcuts.gif";
  import { m } from "$lib/paraglide/messages.js";
</script>

<footer>
  <p>
    <a href={resolve("/")}><strong>hardcore.lt</strong></a>
    rotten since 1995 | {m.powered_by()}
    <a href="https://github.com/execut4ble/vilnius-hardcore"
      ><strong>chebrytė</strong></a
    >

    {#if __COMMIT_HASH__}
      |
      {__COMMIT_HASH__}
    {/if}
  </p>
  <img src={NowItFuckingCuts} alt="nowitfuckingcuts" />
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    font-size: 10pt;
  }

  footer a {
    font-weight: bold;
    text-decoration: none;
  }
</style>
