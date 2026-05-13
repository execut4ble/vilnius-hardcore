<script lang="ts">
  import { enhance } from "$app/forms";
  import FieldError from "./FieldError.svelte";
  import { m } from "$lib/paraglide/messages.js";
  import { page } from "$app/state";
  import { SendHorizontal } from "@lucide/svelte";

  let { form } = $props();

  let isPostingAsCrew = $derived(page.data.user);
  let author = $derived(isPostingAsCrew ? page.data.user?.username : null);
</script>

<strong><h3>{m.add_comment()}</h3></strong>
<form
  id="add-comment"
  method="POST"
  action="?/add_comment"
  autocomplete="off"
  data-name={m.add_comment()}
  use:enhance
>
  <label for="author">{m["form.name"]()}</label>
  <div class="input-wrapper" class:disabled={isPostingAsCrew}>
    <input
      id="author"
      name="author"
      required
      maxlength="30"
      bind:value={author}
      readonly={isPostingAsCrew}
    />
  </div>
  <FieldError errors={form?.errors?.author} />
  <label id="content" for="content">{m["form.comment"]()}</label>
  <textarea
    id="content"
    name="content"
    spellcheck="false"
    required
    maxlength="250"
  ></textarea>
  <FieldError errors={form?.errors?.content} />
  {#if !page.data.user}
    <label for="acab">{m["form.acab_captcha"]()}</label>
    <input id="acab" name="acab" required maxlength="4" />
    <FieldError errors={form?.errors?.acab} />
  {:else}
    <label for="authorIsCrew"
      ><input
        type="checkbox"
        id="authorIsCrew"
        name="authorIsCrew"
        bind:checked={isPostingAsCrew}
      />
      {m["form.post_as_crew"]()}</label
    >
  {/if}
  <br />
  <button type="submit" class="post action"
    ><SendHorizontal /> {m.submit()}</button
  >
  <br /><br />
  <FieldError errors={form?.errors?.submit} />
</form>

<style>
  form#add-comment textarea {
    height: 3.5em;
  }

  .input-wrapper.disabled {
    cursor: not-allowed;
  }

  .input-wrapper.disabled input {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
