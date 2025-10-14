import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import validator from "validator";
import { bannedIp, comment, event, post, shout } from "./schema";
import { m } from "$lib/paraglide/messages.js";
import { z } from "zod";

export const shoutInsertSchema = createInsertSchema(shout, {
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
      .min(1, { message: "Shout can't be empty" })
      .max(150, { message: "Shout must be less than 250 characters" })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        message: "Shout can't be empty",
      }),
});

export const commentInsertSchema = createInsertSchema(comment, {
  author: (schema) =>
    schema
      .max(30, { error: m["error.name_too_long"]({ count: 30 }) })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        error: () => {
          return m["error.name_empty"]();
        },
      }),
  content: (schema) =>
    schema
      .max(250, {
        error: () => {
          return m["error.comment_too_long"]({ count: 250 });
        },
      })
      .trim()
      .refine((value) => !validator.isEmpty(value), {
        error: () => {
          return m["error.comment_empty"]();
        },
      }),
  eventId: z.coerce.number().optional(),
  postId: z.coerce.number().optional(),
})
  .extend({
    acab: z.literal("1312", {
      error: (issue) => {
        if (issue.code === "invalid_value") {
          return m["error.incorrect_value"]();
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
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.title_empty"]();
      },
    }),
  body: (schema) =>
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.body_empty"]();
      },
    }),
});

export const postUpdateSchema = createUpdateSchema(post, {
  title: (schema) =>
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.body_empty"]();
      },
    }),
  body: (schema) =>
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.body_empty"]();
      },
    }),
});

export const eventInsertSchema = createInsertSchema(event, {
  title: (schema) =>
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.title_empty"]();
      },
    }),
  date: z.coerce
    .date({
      error: () => {
        return m["error.date_invalid"]();
      },
    })
    .transform((val) => val.toLocaleString("lt-LT")), // Database does not accept JS Date, transform to string
  is_visible: z.coerce.boolean(),
});

export const eventUpdateSchema = createUpdateSchema(event, {
  title: (schema) =>
    schema.trim().refine((value) => !validator.isEmpty(value), {
      error: () => {
        return m["error.title_empty"]();
      },
    }),
  date: z.coerce
    .date({
      error: () => {
        return m["error.date_invalid"]();
      },
    })
    .transform((val) => val.toLocaleString("lt-LT")), // Database does not accept JS Date, transform to string
  is_visible: z.coerce.boolean(),
});

export const banInsertSchema = createInsertSchema(bannedIp);
