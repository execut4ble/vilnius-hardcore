<script lang="ts">
  import { MetaTags } from "$lib/components";
  import type { BannedIpsArray } from "$lib/types";
  import type { PageProps } from "./$types";
  import { m } from "$lib/paraglide/messages";

  let { data, form }: PageProps = $props();
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
  <!-- TODO: Add remove block button -->
  {#each banlist as ban (ban.id)}
    <li>
      <strong>{ban.ipAddress}</strong> ({m.blocked_on()}
      {new Date(ban.date).toLocaleString("lt-LT")})
    </li>
  {/each}
</ul>
