<script lang="ts">
  import type { PageProps } from "./$types";
  import { Post, Comment, AddCommentForm, MetaTags } from "$lib/components";
  import { slide } from "svelte/transition";
  import type { CommentsArray, Post as PostObject } from "$lib/types";
  import { m } from "$lib/paraglide/messages.js";
  import { page } from "$app/state";

  let { data, form }: PageProps = $props();
  let post: PostObject = $derived(data.post[0]);
  let comments: CommentsArray = $derived(data.comments as CommentsArray);
</script>

<svelte:head>
  <MetaTags title={post ? post.title : "Vilnius Hardcore"} />
</svelte:head>

<h1>{post.title}</h1>
<Post {...post} {form} />
{#if page.data.globalCommentsEnabled}
  <hr class="long" />
  <strong><h2 id="comments">{m.comment_plural()}</h2></strong>

  {#key post.id}
    <div id="comments-list">
      {#each comments as comment (comment.id)}
        <Comment {...comment} />
      {:else}
        {#if !post.disable_comments}
          <div class="text-block" transition:slide>{m.no_comments()}</div>
        {/if}
      {/each}
    </div>
    {#if post.disable_comments}
      <div class="text-block" transition:slide>{m.comments_disabled()}</div>
    {:else}
      <AddCommentForm {form} />
    {/if}
  {/key}
{/if}

<style>
  h2 {
    text-transform: capitalize;
  }
</style>
