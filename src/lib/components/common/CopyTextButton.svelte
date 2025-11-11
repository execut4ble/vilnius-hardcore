<script lang="ts">
  import Fa from "svelte-fa";
  import { Tween } from "svelte/motion";
  import { quadOut } from "svelte/easing";
  import { m } from "$lib/paraglide/messages";

  let { textToCopy, buttonIcon, buttonText } = $props();
  let copied = $state(false);

  const padX = new Tween(0.6, { duration: 200, easing: quadOut });

  async function copyText() {
    try {
      await navigator.clipboard.writeText(textToCopy);
      copied = true;

      padX.set(1);

      setTimeout(() => {
        copied = false;
        padX.set(0.6);
      }, 3000);
    } catch (e) {
      console.error(e);
    }
  }
</script>

<button
  onclick={copyText}
  style="padding-left:{padX.current}rem; padding-right:{padX.current}rem;"
>
  <Fa icon={buttonIcon} />{copied ? m.copied() : buttonText}
</button>

<style>
  button {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    border-radius: 12px;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
    color: var(--color-text-2);
    background: rgba(20, 20, 20, 0);
    justify-content: center;
    width: fit-content; /* natural width */
    border: none;
    transition:
      background 0.2s,
      color 0.2s;
  }
  button:hover {
    color: var(--color-text-1);
    background: rgba(20, 20, 20, 0.75);
    cursor: pointer;
  }
</style>
