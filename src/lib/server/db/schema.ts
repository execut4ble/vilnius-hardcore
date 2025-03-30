import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const event = pgTable("event", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date", { withTimezone: false, mode: "string" }).notNull(),
  description: text("description"),
  slug: text("slug"),
  image: text("image"),
});

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  author: text("user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  body: text("body").notNull(),
  slug: text("slug"),
  image: text("image"),
});

export const comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => event.id, { onDelete: "cascade" })
    .notNull(),
  author: text("author").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  content: text("content").notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Event = typeof event.$inferSelect;

export type Comment = typeof comment.$inferSelect;

export type Post = typeof post.$inferSelect;
