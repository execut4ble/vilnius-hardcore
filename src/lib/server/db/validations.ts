import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import validator from "validator";
import { bannedIp, comment, event, post } from "./schema";
import { m } from "$lib/paraglide/messages.js";
import { z } from "zod";

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
  // Only the fields the form is allowed to write are kept in the schema
  // (author + content, plus acab tripwire). Every other column
  // (id, date, eventId, postId, ipAddress, authorIsCrew) is set
  // server-side in add_comment
})
  .pick({
    author: true,
    content: true,
  })
  .extend({
    acab: z.literal("1312", {
      error: (issue) => {
        if (issue.code === "invalid_value") {
          return m["error.incorrect_value"]();
        }
      },
    }),
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
  disable_comments: z.coerce.boolean().default(false),
}).pick({
  title: true,
  body: true,
  disable_comments: true,
});

export const postUpdateSchema = createUpdateSchema(post, {
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
  disable_comments: z.coerce.boolean().default(false),
}).pick({
  title: true,
  body: true,
  disable_comments: true,
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
  is_visible: z.coerce.boolean().default(false),
  disable_comments: z.coerce.boolean().default(false),
  external_url: z.union([
    z.url({
      error: () => {
        return m["error.url_invalid"]();
      },
    }),
    z.literal(""),
  ]),
}).pick({
  title: true,
  date: true,
  description: true,
  image: true,
  is_visible: true,
  external_url: true,
  disable_comments: true,
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
  is_visible: z.coerce.boolean().default(false),
  disable_comments: z.coerce.boolean().default(false),
  external_url: z.union([
    z.url({
      error: () => {
        return m["error.url_invalid"]();
      },
    }),
    z.literal(""),
  ]),
}).pick({
  title: true,
  date: true,
  description: true,
  image: true,
  is_visible: true,
  external_url: true,
  disable_comments: true,
});

export const banInsertSchema = createInsertSchema(bannedIp).pick({
  ipAddress: true,
});
