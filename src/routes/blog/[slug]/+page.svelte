<script lang="ts">
  import type { PageProps } from "./$types";
  import { Post, Comment, AddCommentForm } from "$lib/components";
  import { slide } from "svelte/transition";
  import type { CommentsArray, Post as PostObject } from "$lib/types";

  let { data, form }: PageProps = $props();
  let post: PostObject = $derived(data.post[0]);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);
</script>

<svelte:head>
  <title>{post ? post.title : "Vilnius Hardcore"}</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<h1>{post.title}</h1>
<Post {...post} {form} />
<strong><h2 id="comments">Comments</h2></strong>

{#key post.id}
  <div class="comments">
    {#each comments as comment (comment.id)}
      <Comment {...comment} />
    {:else}
      <div transition:slide>No comments found. Write something!</div>
    {/each}
  </div>
  <hr class="dim" />
  <AddCommentForm {form} />
{/key}

<style>
  div.comments div {
    margin-bottom: 1em;
  }
</style>
