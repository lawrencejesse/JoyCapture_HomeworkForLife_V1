import { pgTable, text, serial, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  google_uid: text("google_uid").unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  password: z.string().nullable().optional(),
}).pick({
  username: true,
  password: true,
  first_name: true,
  last_name: true,
  google_uid: true,
});

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  user_id: integer("user_id").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  custom_date: timestamp("custom_date"),
  is_deleted: boolean("is_deleted").default(false).notNull(),
  mood: text("mood"),
  location: text("location"),
  media_urls: jsonb("media_urls").$type<string[]>(),
  search_vector: text("search_vector"),
}, (table) => ({
  user_id_idx: index("user_id_idx").on(table.user_id),
  custom_date_idx: index("custom_date_idx").on(table.custom_date),
  tags_idx: index("tags_idx").on(table.tags),
  search_vector_idx: index("search_vector_idx").on(table.search_vector),
}));

export const insertEntrySchema = z.object({
  content: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  user_id: z.number(),
  custom_date: z.string().datetime().optional(),
  mood: z.string().optional(),
  location: z.string().optional(),
  media_urls: z.array(z.string()).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema> & { password?: string | null };
export type User = typeof users.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;
export type Entry = typeof entries.$inferSelect;
