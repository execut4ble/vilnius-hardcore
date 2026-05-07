// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }
  namespace App {
    interface Locals {
      user: import("$lib/server/auth").SessionValidationResult["user"];
      session: import("$lib/server/auth").SessionValidationResult["session"];
    }

    interface Error {
      message: string;
    }

    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
