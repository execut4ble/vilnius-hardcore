<script lang="ts">
  import type { UserInfoData } from "$lib/types";
  let { user }: { user: UserInfoData } = $props();
</script>

<div class="userInfo">
  Logged in as <a href="/crew">{user?.username}</a>
</div>
