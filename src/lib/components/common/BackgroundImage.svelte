<script lang="ts">
  import { fade } from "svelte/transition";

  let { backgroundImage } = $props();
</script>

{#key backgroundImage}
  <div
    class={backgroundImage ? "background-image" : "background-image blank"}
    style={backgroundImage
      ? `background-image: url('../images/${backgroundImage}')`
      : undefined}
    transition:fade={{ duration: 200 }}
  ></div>
{/key}

<style>
  div.background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;
    filter: opacity(40%);
    background-size: cover;
    background-position: center;
  }

  div.background-image:after {
    position: absolute;
    inset: 0;
    content: "";
    background: linear-gradient(
      180deg,
      var(--color-bg) 5%,
      rgba(255, 255, 255, 0),
      var(--color-bg)
    );
  }

  div.background-image.blank {
    filter: none;
  }

  div.background-image.blank:after {
    background: none;
  }
</style>
