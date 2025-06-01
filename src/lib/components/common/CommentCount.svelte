<script lang="ts">
  let { taxonomy, slug, commentCount } = $props();
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale } from "$lib/paraglide/runtime";
</script>

{#if commentCount && commentCount > 0}
  <p class="comments">
    <a href="/{taxonomy}/{slug}#comments"
      >{commentCount}
      {#if getLocale() === "lt"}
        {#if commentCount % 100 >= 11 && commentCount % 100 <= 19}
          {m.comment_genitive()}
        {:else if commentCount % 10 === 1}
          {m.comment_singular()}
        {:else if commentCount % 10 >= 2 && commentCount % 10 <= 9}
          {m.comment_plural()}
        {:else}
          {m.comment_genitive()}
        {/if}
      {:else if commentCount > 1}
        {m.comment_plural()}
      {:else}
        {m.comment_singular()}
      {/if}
    </a>
  </p>
{/if}

<style>
  p.comments a {
    text-decoration: none;
  }
</style>
