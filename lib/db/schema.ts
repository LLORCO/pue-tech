import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const eventStatus = pgEnum("event_status", [
  "borrador",
  "publicado",
  "cancelado",
]);
export type EventStatus = (typeof eventStatus.enumValues)[number];

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  topics: text("topics")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  links: jsonb("links")
    .$type<{ label: string; url: string }[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  communityId: uuid("community_id").references(() => communities.id, {
    onDelete: "set null",
  }),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  venue: text("venue").notNull().default(""),
  online: boolean("online").notNull().default(false),
  registrationUrl: text("registration_url"),
  topics: text("topics")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  status: eventStatus("status").notNull().default("borrador"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Community = typeof communities.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventWithCommunity = Event & { community: Community | null };
