<script lang="ts">
  import type { UserInfoData } from "$lib/types";
  let { user }: { user: UserInfoData } = $props();
  import { m } from "$lib/paraglide/messages.js";
  import { resolve } from "$app/paths";
</script>

<div class="userInfo">
  {m.logged_in()} <a href={resolve("/crew")}>{user?.username}</a>
</div>
