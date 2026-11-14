<script lang="ts">
  import { Search } from "@lucide/svelte";
  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { m } from "$lib/paraglide/messages.js";

  let value: string = $derived(page.url.searchParams.get("query") ?? "");
</script>

<form
  method="POST"
  action={resolve("/search") + "?/query"}
  autocomplete="off"
  use:enhance
  class="search-form"
>
  <button type="submit" aria-label={m["search.title"]()}>
    <Search />
  </button>
  <div class="fields">
    <input
      name="query"
      bind:value
      placeholder={m["search.placeholder"]()}
      minlength="2"
    />
  </div>
</form>

<style>
  form.search-form {
    align-self: stretch;
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0;
    margin-right: 1em;
    margin-left: 1em;
  }

  div.fields {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  form.search-form input {
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding: 6px 8px !important;
    font-size: 10pt !important;
    background-color: var(--bg-color) !important;
  }
</style>
