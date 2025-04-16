import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import validator from "validator";
import { comment, event, post } from "./schema";
import { z } from "zod";

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
  eventId: z.coerce.number().optional(),
  postId: z.coerce.number().optional(),
})
  .extend({
    acab: z.literal("1312", {
      errorMap: () => ({ message: "Incorrect!" }),
    }),
  })
  .refine((data) => data.eventId || data.postId, {
    message: "eventId or postId was not specified",
    path: ["submit"],
  });

export const postInsertSchema = createInsertSchema(post, {
  title: (schema) =>
    schema
      .min(1, { message: "Post title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post title can't be empty",
      }),
  body: (schema) =>
    schema
      .min(1, { message: "Post body can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post body can't be empty",
      }),
});

export const postUpdateSchema = createUpdateSchema(post, {
  title: (schema) =>
    schema
      .min(1, { message: "Post title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post title can't be empty",
      }),
  body: (schema) =>
    schema
      .min(1, { message: "Post body can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Post body can't be empty",
      }),
});

export const eventInsertSchema = createInsertSchema(event, {
  title: (schema) =>
    schema
      .min(1, { message: "Event title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event title can't be empty",
      }),
  date: (schema) =>
    schema
      .min(1, { message: "Event date can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event date can't be empty",
      }),
  is_visible: z.coerce.boolean(),
});

export const eventUpdateSchema = createUpdateSchema(event, {
  title: (schema) =>
    schema
      .min(1, { message: "Event title is required" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event title can't be empty",
      }),
  date: (schema) =>
    schema
      .min(1, { message: "Event date can't be empty" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Event date can't be empty",
      }),
  is_visible: z.coerce.boolean(),
});
