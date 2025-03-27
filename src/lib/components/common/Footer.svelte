<script lang="ts">
  import NowItFuckingCuts from "$lib/images/nowitfuckingcuts.gif";
  const currentYear = $state(new Date().getFullYear());
</script>

<footer>
  <p>
    1995-{currentYear}
    <a href="/"><strong>hardcore.lt</strong></a>
    | powered by
    <a href="https://github.com/execut4ble/vilnius-hardcore"
      ><strong>chebrytė</strong></a
    >
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
