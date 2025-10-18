<script lang="ts">
  import type { PageProps } from "./$types";
  import { Post, Comment, AddCommentForm, MetaTags } from "$lib/components";
  import { slide } from "svelte/transition";
  import type { CommentsArray, Post as PostObject } from "$lib/types";
  import { m } from "$lib/paraglide/messages.js";

  let { data, form }: PageProps = $props();
  let post: PostObject = $derived(data.post[0]);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);
</script>

<svelte:head>
  <MetaTags title={post ? post.title : "Vilnius Hardcore"} />
</svelte:head>

<h1>{post.title}</h1>
<Post {...post} {form} />
<hr class="long" />
<strong><h2 id="comments">{m.comment_plural()}</h2></strong>

{#key post.id}
  <div id="comments-list">
    {#each comments as comment (comment.id)}
      <Comment {...comment} />
    {:else}
      <div class="text-block" transition:slide>{m.no_comments()}</div>
    {/each}
  </div>
  <AddCommentForm {form} />
{/key}

<style>
  h2 {
    text-transform: capitalize;
  }
</style>
