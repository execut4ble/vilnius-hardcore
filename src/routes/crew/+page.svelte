<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages";
  import type { PageServerData, ActionData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();

  let displayRegisterForm: boolean = $state(false);
  let displayChangePasswordForm: boolean = $state(false);
</script>

<svelte:head>
  <MetaTags title="Crew" />
</svelte:head>

<h1>Hi, {data.user.username}!</h1>
<div class="userInfo">
  Your user ID is
  <pre class="inline">{data.user.id}</pre>
</div>
<form method="post" action="?/logout" use:enhance>
  <button>Sign out</button>
</form>

{#if displayChangePasswordForm}
  <br /><br />
  <h2>Change your password</h2>
  <form method="post" action="?/change_password" use:enhance>
    <label for="password">Current password</label>
    <input type="password" name="password" />
    <label for="newPassword">New password</label>
    <input type="password" name="newPass" />
    <label for="newPassRepeat">Confirm new password</label>
    <input type="password" name="newPassRepeat" />
    <br />
    <button>Submit</button>
    <button type="button" onclick={() => (displayChangePasswordForm = false)}
      >Cancel</button
    >
  </form>
  {#if form?.msg}
    <div class="errorMsg">
      <strong>
        {form?.msg ?? ""}
      </strong>
    </div>
  {/if}
{:else}
  <div>
    <button type="button" onclick={() => (displayChangePasswordForm = true)}
      >Change your password</button
    >
  </div>
{/if}

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
  {#if form?.message}
    <div class="errorMsg">
      <strong>
        {form?.message ?? ""}
      </strong>
    </div>
  {/if}
{:else}
  <div>
    <button type="button" onclick={() => (displayRegisterForm = true)}
      >Add new user</button
    >
  </div>
{/if}

<div>
  <button type="button" onclick={() => goto(resolve("/crew/jail/"))}
    >{m.blocked_ips_heading()}</button
  >
</div>

<style>
  div.userInfo {
    margin-bottom: 2em;
  }

  div button {
    margin-bottom: 2em;
  }
</style>
