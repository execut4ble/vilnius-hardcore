<script lang="ts">
  import { enhance } from "$app/forms";
  import { MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages";
  import type { PageServerData, ActionData } from "./$types";

  let { data, form }: { data: PageServerData; form: ActionData } = $props();
  let displayChangePasswordForm: boolean = $state(false);
</script>

<svelte:head>
  <MetaTags title="Crew" />
</svelte:head>

<h2>{m.hello()}, {data.user.username}!</h2>
<div class="user-info text-block">
  {m.your_userid()}
  <pre class="inline">{data.user.id}</pre>
</div>

<div>
  <form method="post" action="?/logout" use:enhance>
    <button>{m.sign_out()}</button>
  </form>
</div>

{#if displayChangePasswordForm}
  <br /><br />
  <h2>{m["password_form.change_password"]()}</h2>
  <form method="post" action="?/change_password" use:enhance>
    <label for="password">{m["password_form.current_password"]()}</label>
    <input type="password" name="password" />
    <label for="newPassword">{m["password_form.new_password"]()}</label>
    <input type="password" name="newPass" />
    <label for="newPassRepeat">{m["password_form.repeat_password"]()}</label>
    <input type="password" name="newPassRepeat" />
    <br />
    <button>{m.submit_form()}</button>
    <button type="button" onclick={() => (displayChangePasswordForm = false)}
      >{m.cancel()}</button
    >
  </form>
  {#if form?.msg}
    <div class="field-error">
      <strong>
        {form?.msg ?? ""}
      </strong>
    </div>
  {/if}
{:else}
  <div>
    <button type="button" onclick={() => (displayChangePasswordForm = true)}
      >{m["password_form.change_password"]()}</button
    >
  </div>
{/if}
