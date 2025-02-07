import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5137,
  },
  plugins: [enhancedImages(), sveltekit()],
});
