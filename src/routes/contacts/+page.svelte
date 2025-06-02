<script>
  import { MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale } from "$lib/paraglide/runtime";
</script>

<svelte:head>
  <MetaTags title={m["navigation.contacts"]()} />
</svelte:head>

<h1>{m["navigation.contacts"]()}</h1>

{#if getLocale() === "lt"}
  <p>
    Norėtum tapti hardcore.lt korespondentu arba turi įdomios medžiagos, kuria
    mielai pasidalintum? <br />
    Rašyk puslapio administratoriams:
  </p>

  <strong>vilnius (a) hardcore.lt</strong>

  <p>XI20:</p>

  <strong>1120 (a) hardcore.lt</strong>

  <p>Klausimai? Ieškai vietinės chebros?</p>

  <strong>nomad (a) hardcore.lt</strong>
{:else if getLocale() === "fi"}
  <p>
    Onko sinulla jotain mielenkiintoista, mitä haluaisit jakaa kanssamme? <br />
    Lähetä sähköpostia verkkosivuvastaaville:
  </p>

  <strong>vilnius (a) hardcore.lt</strong>

  <p>Jos haluat soittaa bändisi kanssa XI20:ssa, kirjoita osoitteeseen:</p>

  <strong>1120 (a) hardcore.lt</strong>

  <p>Kysymyksiä? Eksyitkö? Haluatko tavata paikallisia punkkareita?</p>

  <strong>nomad (a) hardcore.lt</strong>
{:else}
  <p>
    Do you have anything interesting you'd like to share with us? <br />
    E-mail the webmasters:
  </p>

  <strong>vilnius (a) hardcore.lt</strong>

  <p>XI20:</p>

  <strong>1120 (a) hardcore.lt</strong>

  <p>Questions? Lost? Need to meet local punx?</p>

  <strong>nomad (a) hardcore.lt</strong>
{/if}
