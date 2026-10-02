import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
  },
  testDir: "tests/specs",
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure", // or "on-first-retry" if you use retries
    video: "retain-on-failure", // optional
    reducedMotion: "reduce",
  },
});
