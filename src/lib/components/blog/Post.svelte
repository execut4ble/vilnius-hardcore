<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { FieldError } from "$lib/components";
  import type { PostComponent } from "$lib/types";
  import {
    faPenToSquare,
    faSave,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import remarkYoutubePlugin from "remark-youtube";
  import Markdown from "svelte-exmarkdown";
  import Fa from "svelte-fa";
  import type { Plugin } from "svelte-exmarkdown";
  import rehypeRaw from "rehype-raw";
  import RemoveItemForm from "../common/RemoveItemForm.svelte";

  let { preview = false, form, ...post }: PostComponent = $props();

  let isEditing: boolean = $state(false);
  let title: string = $derived(post.title);
  let slug: string | null = $state(post.slug);
  let date: string = $derived(new Date(post.date).toLocaleString("lt-LT"));
  let authorUsername: string | null = $derived(post.authorUsername);
  let authorDisplayName: string | null = $derived(post.authorName);
  let body: string = $derived(post.body);
  let previewBody: string = $derived(
    body ? body.substring(0, 500) + "\u2026" : "",
  );
  let commentCount: number | null | undefined = $derived(post.comments);

  function updatePost({ formData }: { formData: FormData }) {
    formData.set("slug", slug as string);

    return async ({ update, result }) => {
      if (result.type === "success") {
        if (page.params.slug && result?.data[0]?.slug !== slug) {
          goto(result.data[0].slug, { noScroll: true, invalidateAll: true });
          isEditing = false;
          slug = result.data[0].slug;
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
      <h2><a href="/blog/{slug}"><strong>{title}</strong></a></h2>
    {/if}
    {#if page.url.pathname !== "/" && page.data.user}
      <div class="actions">
        <button class="post action" onclick={() => (isEditing = true)}
          ><Fa icon={faPenToSquare} /> edit</button
        >
        <RemoveItemForm {slug} action="?/remove_post" />
      </div>
    {/if}
    <div class="meta">
      <p class="postInfo">
        Posted by {authorUsername || authorDisplayName || "anonymous"} | {date}
      </p>
      {#if commentCount && commentCount > 0}
        <p class="comments">
          <a href="/blog/{slug}#comments"
            >{commentCount}
            {#if commentCount < 2}
              comment
            {:else}
              comments
            {/if}
          </a>
        </p>
      {/if}
    </div>
    <div class="content">
      {#if body && preview && body.length > 500}
        <Markdown md={previewBody} {plugins} />
      {:else}
        <Markdown md={body} {plugins} />
      {/if}
    </div>
  {:else}
    <form
      method="POST"
      action="?/update_post"
      autocomplete="off"
      use:enhance={updatePost}
    >
      <label for="title">Title</label>
      <input id="title" name="title" value={post.title} required />
      <FieldError errors={form?.errors?.title} />
      <label id="body" for="body">Post body</label>
      <textarea
        class="body"
        name="body"
        value={post.body}
        spellcheck="false"
        required
      ></textarea>
      <FieldError errors={form?.errors?.body} />
      <br />
      <button type="submit" class="post action"
        ><Fa icon={faSave} /> save</button
      >
      <button
        type="button"
        class="post action"
        onclick={() => {
          isEditing = false;
        }}><Fa icon={faXmark} /> cancel</button
      >
    </form>
  {/if}
</post>

<style>
  div.content {
    margin: 2em 0 2em 0;
  }

  textarea.body {
    width: 100%;
    max-width: 100%;
  }

  div.meta p {
    margin-top: 0;
    margin-bottom: 0;
  }

  div.meta p a {
    text-decoration: none;
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
