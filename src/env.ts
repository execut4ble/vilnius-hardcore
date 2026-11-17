import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  DISABLE_COMMENTS: { schema: (input) => input ?? "" },
  DATABASE_URL: { static: true },
  MIKKE_ENDPOINT: {
    schema: (input) =>
      input ?? "https://oldschool.hardcore.lt/mikke/mikke.php",
  },
});
