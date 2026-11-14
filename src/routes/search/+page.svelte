<script lang="ts">
  import type { PageProps } from "./$types";
  import { Event, Post, ItemCount, MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages.js";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <MetaTags title={m["search.title"]()} />
</svelte:head>

<h1>{m["search.title"]()}</h1>

{#if !data.query}
  <p>{m["search.no_query"]()}</p>
{:else if data.results.length === 0}
  <p>{m["search.no_results"]({ query: data.query })}</p>
{:else}
  <ul class="item-list">
    {#each data.results as result (result.type + result.id)}
      <li>
        {#if result.type === "event"}
          <Event {...result} />
        {:else}
          <Post {...result} preview />
        {/if}
      </li>
      <hr class="long" />
    {/each}
  </ul>
  <ItemCount displayedItems={data.results.length} totalItems={data.total} />
{/if}
