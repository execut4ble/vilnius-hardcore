import { writable } from "svelte/store";

export type ThemeMode = "light" | "dark" | "greensteam";

export const theme = writable<ThemeMode>("light");
