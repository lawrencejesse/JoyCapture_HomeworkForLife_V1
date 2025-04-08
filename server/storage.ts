import { users, type User, type InsertUser, entries, type Entry, type InsertEntry } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  getEntries(userId: number, limit: number, offset: number): Promise<Entry[]>;
  getEntry(id: number, userId: number): Promise<Entry | undefined>;
  updateEntry(id: number, userId: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number, userId: number): Promise<boolean>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const [entry] = await db
      .insert(entries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async getEntries(userId: number, limit: number, offset: number): Promise<Entry[]> {
    console.log(`Getting entries for user ${userId} with limit ${limit} and offset ${offset}`);
    
    const results = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .orderBy(desc(entries.createdAt))
      .limit(limit)
      .offset(offset);
      
    console.log(`Found ${results.length} entries for user ${userId}`);
    return results;
  }

  async getEntry(id: number, userId: number): Promise<Entry | undefined> {
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)));
    return entry || undefined;
  }

  async updateEntry(id: number, userId: number, entryUpdate: Partial<InsertEntry>): Promise<Entry | undefined> {
    const [entry] = await db
      .update(entries)
      .set(entryUpdate)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)))
      .returning();
    return entry || undefined;
  }

  async deleteEntry(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
