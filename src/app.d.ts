// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      sql: PostgresConnection;
      user: import("$lib/server/auth").SessionValidationResult["user"];
      session: import("$lib/server/auth").SessionValidationResult["session"];
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module "@fortawesome/pro-solid-svg-icons/index.es" {
  export * from "@fortawesome/pro-solid-svg-icons";
}

export {};
