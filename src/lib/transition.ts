import { slide as svelteSlide } from "svelte/transition";

export function slide(node: Element, params = {}) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return svelteSlide(node, reduce ? { ...params, duration: 0 } : params);
}
