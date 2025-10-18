<script lang="ts">
  import { enhance } from "$app/forms";
  import { MetaTags } from "$lib/components";
  import type { PageServerData, ActionData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();
  let displayChangePasswordForm: boolean = $state(false);
</script>

<svelte:head>
  <MetaTags title="Crew" />
</svelte:head>

<h2>Hi, {data.user.username}!</h2>
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

<style>
  div.userInfo {
    margin-bottom: 2em;
  }

  div button {
    margin-bottom: 2em;
  }
</style>
