<script lang="ts">
  import { enhance } from "$app/forms";
  import Fa from "svelte-fa";
  import FieldError from "./FieldError.svelte";
  import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
  import { m } from "$lib/paraglide/messages.js";

  let { form } = $props();
</script>

<strong><h3>{m.add_comment()}</h3></strong>
<form
  class="comment"
  method="POST"
  action="?/add_comment"
  autocomplete="off"
  use:enhance
>
  <label for="author">{m["form.name"]()}</label>
  <input id="author" name="author" required maxlength="30" />
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
  <label for="acab">{m["form.acab_captcha"]()}</label>
  <input id="acab" name="acab" required maxlength="4" />
  <FieldError errors={form?.errors?.acab} />
  <br />
  <button type="submit" class="post action"
    ><Fa icon={faCommentDots} /> {m.submit()}</button
  >
  <br /><br />
  <FieldError errors={form?.errors?.submit} />
</form>

<style>
  form.comment textarea {
    height: 3.5em;
  }
</style>
