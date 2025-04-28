<script lang="ts">
  let { taxonomy, slug, commentCount } = $props();
</script>

{#if commentCount && commentCount > 0}
  <p class="comments">
    <a href="/{taxonomy}/{slug}#comments"
      >{commentCount}
      {#if commentCount < 2}
        comment
      {:else}
        comments
      {/if}
    </a>
  </p>
{/if}

<style>
  p.comments a {
    text-decoration: none;
  }
</style>
