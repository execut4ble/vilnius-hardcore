<script>
  import { MetaTags } from "$lib/components";
  import { getLocale } from "$lib/paraglide/runtime";
  import Markdown from "svelte-exmarkdown";
  import contentLt from "./xi20-guidelines-lt.md?raw";
  import contentEn from "./xi20-guidelines-en.md?raw";
  import contentFi from "./xi20-guidelines-fi.md?raw";

  const title = $derived(
    getLocale() === "lt"
      ? "Vienuolika sakinių apie tūsą XI20 arba kaip nebūti dalbajobu"
      : getLocale() === "fi"
        ? "Yksitoista lausetta bilettämisestä XI20:ssä eli miten olla olematta idiootti"
        : "Eleven sentences on partying at XI20 or how not to be a dumbfuck",
  );
</script>

<svelte:head>
  <MetaTags {title} description={title} />
</svelte:head>

<div class="box" data-name={title}>
  {#if getLocale() === "lt"}
    <h1>VIENUOLIKA SAKINIŲ APIE TŪSĄ XI20 ARBA KAIP NEBŪTI DALBAJOBU</h1>
    <Markdown md={contentLt} />
  {/if}

  {#if getLocale() === "en"}
    <h1>ELEVEN SENTENCES ON PARTYING AT XI20 OR HOW NOT TO BE A DUMBFUCK</h1>
    <Markdown md={contentEn} />
  {/if}

  {#if getLocale() === "fi"}
    <h1>
      YKSITOISTA LAUSETTA BILETTÄMISESTÄ XI20:SSÄ ELI MITEN OLLA OLEMATTAA
      IDIOOTTI
    </h1>
    <Markdown md={contentFi} />
  {/if}
</div>
