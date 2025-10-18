<script lang="ts">
  import { MetaTags } from "$lib/components";
  import type { PageProps } from "./$types";
  import { m } from "$lib/paraglide/messages";
  import { enhance } from "$app/forms";

  let { data, form }: PageProps = $props();
  let users = $derived(data.users);
  let displayRegisterForm: boolean = $state(false);
</script>

<svelte:head>
  <MetaTags title="Users" />
</svelte:head>

<h2>{m.users()}</h2>
{#if users.length > 0}
  <div>{m.list_of_users()}</div>
{/if}

<ul>
  {#each users as user (user.id)}
    <li>{user.username}</li>
  {/each}
</ul>

{#if displayRegisterForm}
  <hr class="long" />
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
