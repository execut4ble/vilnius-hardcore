<script lang="ts">
  import { enhance } from "$app/forms";
  import Fa from "svelte-fa";
  import FieldError from "./FieldError.svelte";
  import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

  let { form } = $props();

  function addComment() {
    return async ({ update, result }) => {
      await update();
      if (result.type === "error") {
        console.error("Form submission failed:", result.status);
      }
    };
  }
</script>

<strong><h3>Add a comment</h3></strong>
<form
  class="comment"
  method="POST"
  action="?/add_comment"
  autocomplete="off"
  use:enhance={addComment}
>
  <label for="author">Name</label>
  <input id="author" name="author" required maxlength="30" />
  <FieldError errors={form?.errors?.author} />
  <label id="content" for="content">Comment</label>
  <textarea name="content" spellcheck="false" required maxlength="250"
  ></textarea>
  <FieldError errors={form?.errors?.content} />
  <label for="acab">Are you a cop? Enter the ACAB digits</label>
  <input id="acab" name="acab" required maxlength="4" />
  <FieldError errors={form?.errors?.acab} />
  <br />
  <button type="submit" class="post action"
    ><Fa icon={faCommentDots} /> post</button
  >
  <br /><br />
  <FieldError errors={form?.errors?.submit} />
</form>

<style>
  form.comment textarea {
    height: 3.5em;
  }
</style>
