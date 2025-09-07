<script lang="ts">
  import { enhance } from "$app/forms";
  import { MetaTags } from "$lib/components";
  import type { ActionData, PageServerData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();

  const canRegister: boolean | undefined = $state(data.registrationAllowed);
</script>

<svelte:head>
  <MetaTags title="Login" />
</svelte:head>

<h1>Crew?</h1>
{#if canRegister}
  Create a new user for first time setup
{/if}
<form method="post" action="?/login" use:enhance>
  <label for="username">Username</label>
  <input name="username" />
  <label for="password">Password</label>
  <input type="password" name="password" />
  <br />
  {#if canRegister}
    <button formaction="?/register">Register</button>
  {:else}
    <button>Login</button>
  {/if}
</form>
<p class="error" style="color: red">{form?.message ?? ""}</p>
