<script lang="ts">
  import type { UserInfoData } from "$lib/types";
  let { user }: { user: UserInfoData } = $props();
</script>

<div class="userInfo">
  {#if user}
    Logged in as <a href="/crew">{user.username}</a>
  {/if}
</div>
