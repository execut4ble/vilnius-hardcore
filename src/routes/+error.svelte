<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Hardcore</title>
</svelte:head>

<section>
  <h1>{page.status} {page.error.message}</h1>

  {#if page.status === 404}
    <h2>The requested page was not found.</h2>

    <p><a href="/">Go home</a>.</p>
  {/if}

  {#if page.status === 403}
    <h2>You're not supposed to be here. Forget about all this.</h2>

    <p><a href={page.url.pathname}>Try again</a> or <a href="/">go home</a>.</p>
  {/if}

  {#if page.status === 500}
    <h2>An internal error occurred.</h2>

    <p><a href={page.url.pathname}>Try again</a> or <a href="/">go home</a>.</p>
  {/if}
</section>
