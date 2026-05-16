<script lang="ts">
  import { onMount } from "svelte";
  import { theme, type ThemeMode } from "$lib/stores/theme";

  function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;

    root.classList.remove("light", "dark", "greensteam");
    root.classList.add(mode);

    document.cookie = `appearanceMode=${mode}; path=/; max-age=31536000; SameSite=Lax`;
  }

  onMount(() => {
    const root = document.documentElement;

    if (root.classList.contains("greensteam")) {
      theme.set("greensteam");
    } else if (root.classList.contains("dark")) {
      theme.set("dark");
    } else {
      theme.set("light");
    }
  });

  $effect(() => {
    applyTheme($theme);
  });
</script>
