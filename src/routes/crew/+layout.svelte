<script lang="ts">
  import { CrewMenu } from "$lib/components";
  import type { LayoutProps } from "./$types";
  let { data, children }: LayoutProps = $props();
</script>

{#if data.user}
  <CrewMenu />
{/if}

{@render children?.()}
