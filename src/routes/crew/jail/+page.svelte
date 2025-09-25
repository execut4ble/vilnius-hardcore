<script lang="ts">
  import { MetaTags } from "$lib/components";
  import type { BannedIpsArray } from "$lib/types";
  import type { PageProps } from "./$types";
  import { m } from "$lib/paraglide/messages";
  import { BannedAddress } from "$lib/components";

  let { data }: PageProps = $props();
  let banlist: BannedIpsArray = $derived(data.banlist as BannedIpsArray);
</script>

<svelte:head>
  <MetaTags title="Blocked IPs" />
</svelte:head>

<h2>{m.blocked_ips_heading()}</h2>

{#if banlist.length > 0}
  <p>{m.blocked_ips_description()}</p>
{:else}
  <p>{m.blocked_ips_no_entries()}</p>
{/if}

<ul>
  {#each banlist as ban (ban.id)}
    <li>
      <BannedAddress {...ban} />
    </li>
  {/each}
</ul>
