import { encodeBase32LowerCase } from "@oslojs/encoding";

export function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

export function validateUsername(username: unknown): username is string {
  return (
    typeof username === "string" &&
    username.length >= 2 &&
    username.length <= 31 &&
    /^[a-z0-9@._-]+$/.test(username)
  );
}

export function validatePassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 6 &&
    password.length <= 255
  );
}
