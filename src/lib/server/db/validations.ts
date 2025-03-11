import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import validator from "validator";
import { comment } from "./schema";

export const commentInsertSchema = createInsertSchema(comment, {
  author: (schema) =>
    schema
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must be less than 30 characters" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Name can't be empty",
      }),
  content: (schema) =>
    schema
      .min(1, { message: "Comment can't be empty" })
      .max(250, { message: "Comment must be less than 250 characters" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Comment can't be empty",
      }),
  eventId: z.coerce.number(),
  date: z.coerce.date(),
});
