import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  age: integer("age"),
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

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Event = typeof event.$inferSelect;
