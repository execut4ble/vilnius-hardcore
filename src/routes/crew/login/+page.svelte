<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Login</title>
  <meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
  <h1>Crew?</h1>
  <form method="post" action="?/login" use:enhance>
    <label for="username">Username</label>
    <input name="username" />
    <label for="password">Password</label>
    <input type="password" name="password" />
    <br />
    <button>Login</button>
  </form>
  <p style="color: red">{form?.message ?? ""}</p>
</section>
