<script lang="ts">
  import { MetaTags } from "$lib/components";
  import type { BannedIpsArray } from "$lib/types";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  let banlist: BannedIpsArray = $derived(data.banlist as BannedIpsArray);
</script>

<svelte:head>
  <MetaTags title="Blocked IPs" />
</svelte:head>

<h2>Blocked IP addresses</h2>

{#if banlist.length > 0}
  <p>These IP addresses are prohibited from posting comments.</p>
{:else}
  <p>Once you block an IP address it will appear here.</p>
{/if}

<ul>
  <!-- TODO: Add remove block button -->
  {#each banlist as ban (ban.id)}
    <li>
      <strong>{ban.ipAddress}</strong> (blocked on {new Date(
        ban.date,
      ).toLocaleString("lt-LT")})
    </li>
  {/each}
</ul>
