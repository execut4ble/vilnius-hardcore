import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import validator from "validator";
import { comment, event, post } from "./schema";
import { z } from "zod/v4";

export const commentInsertSchema = createInsertSchema(comment, {
  author: (schema) =>
    schema
      .min(1, { error: "Name is required" })
      .max(30, { error: "Name must be less than 30 characters" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        error: "Name can't be empty",
      }),
  content: (schema) =>
    schema
      .min(1, { error: "Comment can't be empty" })
      .max(250, { error: "Comment must be less than 250 characters" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        error: "Comment can't be empty",
      }),
  eventId: z.coerce.number().optional(),
  postId: z.coerce.number().optional(),
})
  .extend({
    acab: z.literal("1312", {
      error: (issue) => {
        if (issue.code === "invalid_value") {
          return "Incorrect!";
        }
      },
    }),
  })
  .refine((data) => data.eventId || data.postId, {
    error: "eventId or postId was not specified",
    path: ["submit"],
  });

export const postInsertSchema = createInsertSchema(post, {
  title: (schema) =>
    schema
      .min(1, { error: "Post title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post title can't be empty",
      }),
  body: (schema) =>
    schema
      .min(1, { error: "Post body can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post body can't be empty",
      }),
});

export const postUpdateSchema = createUpdateSchema(post, {
  title: (schema) =>
    schema
      .min(1, { error: "Post title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post title can't be empty",
      }),
  body: (schema) =>
    schema
      .min(1, { error: "Post body can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post body can't be empty",
      }),
});

export const eventInsertSchema = createInsertSchema(event, {
  title: (schema) =>
    schema
      .min(1, { error: "Event title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event title can't be empty",
      }),
  date: (schema) =>
    schema
      .min(1, { error: "Event date can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event date can't be empty",
      }),
  is_visible: z.coerce.boolean(),
});

export const eventUpdateSchema = createUpdateSchema(event, {
  title: (schema) =>
    schema
      .min(1, { error: "Event title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event title can't be empty",
      }),
  date: (schema) =>
    schema
      .min(1, { error: "Event date can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        error: "Event date can't be empty",
      }),
  is_visible: z.coerce.boolean(),
});
