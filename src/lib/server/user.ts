import { encodeBase32LowerCase } from "@oslojs/encoding";
import { z } from "zod";

export function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

export const usernameSchema = z
  .string()
  .min(2, { error: "Username must be at least 2 characters" })
  .max(31, "Username must be at most 31 characters")
  .regex(
    /^[a-z0-9@._-]+$/,
    "Username must not contain upper case letters or special characters (@ . _ and - are allowed)",
  );

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(255, "Password must be at most 255 characters");

export function validateUsername(input: unknown): input is string {
  return usernameSchema.safeParse(input).success;
}

export function validatePassword(input: unknown): input is string {
  return passwordSchema.safeParse(input).success;
}
