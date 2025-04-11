import { users, type User, type InsertUser, entries, type Entry, type InsertEntry } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc, sql, ilike, or, isNull, SQL } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface SearchParams {
  query?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  category?: string;
  mood?: string;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleUid(googleUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleUid(userId: number, googleUid: string): Promise<void>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  getEntries(user_id: number, limit: number, offset: number): Promise<Entry[]>;
  searchEntries(user_id: number, params: SearchParams, limit: number, offset: number): Promise<Entry[]>;
  getEntry(id: number, user_id: number): Promise<Entry | undefined>;
  updateEntry(id: number, user_id: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number, user_id: number): Promise<boolean>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByGoogleUid(googleUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.google_uid, googleUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const valuesToInsert = {
      ...insertUser,
      password: insertUser.password === undefined ? null : insertUser.password,
      updated_at: new Date()
    };
    const [user] = await db
      .insert(users)
      .values(valuesToInsert)
      .returning();
    return user;
  }

  async updateUserGoogleUid(userId: number, googleUid: string): Promise<void> {
    await db.update(users)
      .set({ google_uid: googleUid, updated_at: new Date() })
      .where(eq(users.id, userId));
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    // Create search vector from content and tags
    const search_vector = [
      insertEntry.content,
      ...(insertEntry.tags || []),
      insertEntry.category,
      insertEntry.mood,
      insertEntry.location
    ].filter(Boolean).join(' ');

    const entryData = {
      ...insertEntry,
      custom_date: insertEntry.custom_date ? new Date(insertEntry.custom_date) : null,
      updated_at: new Date(),
    };

    const [entry] = await db
      .insert(entries)
      .values(entryData)
      .returning();
    return entry;
  }

  async getEntries(user_id: number, limit: number, offset: number): Promise<Entry[]> {
    console.log(`Getting entries for user ${user_id} with limit ${limit} and offset ${offset}`);
    
    const results = await db
      .select()
      .from(entries)
      .where(and(
        eq(entries.user_id, user_id),
        eq(entries.is_deleted, false)
      ))
      .orderBy(desc(entries.created_at))
      .limit(limit)
      .offset(offset);
      
    console.log(`Found ${results.length} entries for user ${user_id}`);
    return results;
  }

  async searchEntries(user_id: number, params: SearchParams, limit: number, offset: number): Promise<Entry[]> {
    const conditions: SQL[] = [
      eq(entries.user_id, user_id),
      eq(entries.is_deleted, false)
    ];

    if (params.query) {
      conditions.push(
        or(
          ilike(entries.content, `%${params.query}%`),
          ilike(entries.search_vector, `%${params.query}%`)
        )!
      );
    }

    if (params.startDate) {
      conditions.push(sql`${entries.custom_date} >= ${params.startDate}`);
    }

    if (params.endDate) {
      conditions.push(sql`${entries.custom_date} <= ${params.endDate}`);
    }

    if (params.tags?.length) {
      conditions.push(sql`${entries.tags} && ${params.tags as any}`);
    }

    if (params.category) {
      conditions.push(eq(entries.category, params.category));
    }

    if (params.mood) {
      conditions.push(eq(entries.mood, params.mood));
    }

    const results = await db
      .select()
      .from(entries)
      .where(and(...conditions))
      .orderBy(desc(entries.created_at))
      .limit(limit)
      .offset(offset);

    return results;
  }

  async getEntry(id: number, user_id: number): Promise<Entry | undefined> {
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(
        eq(entries.id, id),
        eq(entries.user_id, user_id),
        eq(entries.is_deleted, false)
      ));
    return entry || undefined;
  }

  async updateEntry(id: number, user_id: number, entryUpdate: Partial<InsertEntry>): Promise<Entry | undefined> {
    const updateData: Partial<Entry> = {
      ...entryUpdate,
      custom_date: entryUpdate.custom_date ? new Date(entryUpdate.custom_date) : undefined,
      updated_at: new Date(),
    };

    const [entry] = await db
      .update(entries)
      .set(updateData)
      .where(and(
        eq(entries.id, id),
        eq(entries.user_id, user_id),
        eq(entries.is_deleted, false)
      ))
      .returning();
    return entry || undefined;
  }

  async deleteEntry(id: number, user_id: number): Promise<boolean> {
    // Soft delete
    const [entry] = await db
      .update(entries)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(and(
        eq(entries.id, id),
        eq(entries.user_id, user_id),
        eq(entries.is_deleted, false)
      ))
      .returning();
    return !!entry;
  }
}

export const storage = new DatabaseStorage();
