<script lang="ts">
  import type { PageProps } from "./$types";
  import { Post } from "$lib/components";

  let { data, form }: PageProps = $props();
  let post = $derived(data.post[0]);
</script>

<svelte:head>
  <title>{post ? post.title : "Vilnius Hardcore"}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<h1>{post.title}</h1>
<Post {...post} {form} />
