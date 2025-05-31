<script lang="ts">
  import type { UserInfoData } from "$lib/types";
  let { user }: { user: UserInfoData } = $props();
  import { m } from "$lib/paraglide/messages.js";
</script>

<div class="userInfo">
  {m.loggedin()} <a href="/crew">{user?.username}</a>
</div>
