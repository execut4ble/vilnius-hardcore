<script lang="ts">
  import { appearance } from "@friendofsvelte/toggle";
  import { onMount } from "svelte";

  const init = () => {
    if (document.documentElement.classList.contains("dark")) {
      appearance.dark = true;
    } else if (document.documentElement.classList.contains("light")) {
      appearance.dark = false;
    }

    if (appearance.dark === null) {
      appearance.dark = false;
    }
  };
  const track = () => {
    if (appearance.dark != null) {
      document.cookie = `appearanceMode=${appearance.dark ? "dark" : "light"}; path=/; max-age=31536000; SameSite=Lax`;
      if (appearance.dark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    }
  };
  $effect(track);
  onMount(init);
</script>
