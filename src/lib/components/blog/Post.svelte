<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { RemoveItemForm, CommentCount, PostEntryForm } from "$lib/components";
  import type { PostComponent } from "$lib/types";
  import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
  import remarkYoutubePlugin from "remark-youtube";
  import Markdown from "svelte-exmarkdown";
  import Fa from "svelte-fa";
  import type { Plugin } from "svelte-exmarkdown";
  import rehypeRaw from "rehype-raw";
  import { m } from "$lib/paraglide/messages.js";

  let { preview = false, form, ...post }: PostComponent = $props();

  let isEditing: boolean = $state(false);
  let title: string = $derived(post.title);
  let slug: string | null = $derived(post.slug);
  let date: string = $derived(new Date(post.date).toLocaleString("lt-LT"));
  let authorUsername: string | null | undefined = $derived(post.authorUsername);
  let authorDisplayName: string | null = $derived(post.authorName);
  let body: string = $derived(post.body);

  function updatePost({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.type === "success") {
        if (page.params.slug && result?.data[0]?.slug !== slug) {
          goto(result.data[0].slug, { noScroll: true, invalidateAll: true });
          isEditing = false;
        } else {
          await update({ reset: false }).then(() => {
            isEditing = false;
          });
        }
      }

      if (result.type === "failure") {
        await update({ reset: false }); // Update to throw form errors
      }

      if (result.type === "error") {
        console.error("Form submission failed:", result.status);
        await update({ reset: false }); // Update to throw form errors
      }
    };
  }

  const plugins: Plugin[] = [
    { remarkPlugin: [remarkYoutubePlugin], rehypePlugin: [rehypeRaw] },
  ];
</script>

<post>
  {#if !isEditing}
    {#if page.params.slug !== slug}
      <h2 class="title"><a href="/blog/{slug}"><strong>{title}</strong></a></h2>
    {/if}
    {#if page.url.pathname !== "/" && page.data.user}
      <div class="actions">
        <button id="edit" class="post action" onclick={() => (isEditing = true)}
          ><Fa icon={faPenToSquare} /> {m.edit()}</button
        >
        <RemoveItemForm {slug} action="?/remove_post" />
      </div>
    {/if}
    <div class="meta">
      <p class="postInfo">
        {m.posted_by()}
        {authorUsername || authorDisplayName || m.anonymous()} | {date}
      </p>
      <CommentCount taxonomy="blog" {slug} commentCount={post.comments} />
    </div>
    <div class={preview ? "content preview" : "content"}>
      <Markdown md={body} {plugins} />
    </div>
  {:else}
    <PostEntryForm
      {form}
      formAction="?/update_post"
      enhanceFunction={updatePost}
      bind:entryMode={isEditing}
      {...post}
    />
  {/if}
</post>

<style>
  div.content {
    margin: 2em 0 2em 0;
  }

  div.preview {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 7;
    line-clamp: 7;
    overflow: hidden;
  }

  div.meta p {
    margin-top: 0;
    margin-bottom: 0;
  }

  div.meta {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
  }

  @media (max-width: 720px) {
    div.meta {
      flex-direction: column;
      gap: 1em;
    }
  }
</style>
