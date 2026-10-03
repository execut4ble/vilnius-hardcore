import { defineEnvVars } from "@sveltejs/kit/env";

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
  DISABLE_COMMENTS: { schema: (input) => input ?? "" },
  DATABASE_URL: { static: true },
});
