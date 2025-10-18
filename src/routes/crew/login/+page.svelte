<script lang="ts">
  import { enhance } from "$app/forms";
  import { MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages";
  import type { ActionData, PageServerData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();

  const canRegister: boolean | undefined = $state(data.registrationAllowed);
</script>

<svelte:head>
  <MetaTags title="Login" />
</svelte:head>

<h1>Crew?</h1>
{#if canRegister}
  {m.register_user_first_time()}
{/if}
<form method="post" action="?/login" use:enhance>
  <label for="username">{m.username()}</label>
  <input name="username" />
  <label for="password">{m.password()}</label>
  <input type="password" name="password" />
  <br />
  {#if canRegister}
    <button formaction="?/register">{m.register()}</button>
  {:else}
    <button>{m.login()}</button>
  {/if}
</form>
<p class="field-error">{form?.message ?? ""}</p>
