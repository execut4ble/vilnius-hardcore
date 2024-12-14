<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData, ActionData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();

  let displayRegisterForm: boolean = $state(false);
</script>

<svelte:head>
  <title>Crew</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h1>Hi, {data.user.username}!</h1>
  <div class="userInfo">
    Your user ID is
    <pre class="inline">{data.user.id}</pre>
  </div>
  <form method="post" action="?/logout" use:enhance>
    <button>Sign out</button>
  </form>

  {#if displayRegisterForm}
    <br /><br />
    <h2>Register new user</h2>
    <form method="post" action="?/register" use:enhance>
      <label for="username">Username</label>
      <input name="username" />
      <label for="password">Password</label>
      <input type="password" name="password" />
      <br />
      <button>Submit</button>
      <button type="button" onclick={() => (displayRegisterForm = false)}
        >Cancel</button
      >
    </form>
    {form?.message ?? ""}
  {:else}
    <div>
      <button type="button" onclick={() => (displayRegisterForm = true)}
        >Add new user</button
      >
    </div>
  {/if}
</section>

<style>
  div.userInfo {
    margin-bottom: 2em;
  }
</style>
