import { users, type User, type InsertUser, entries, type Entry, type InsertEntry } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  getEntries(userId: number, limit: number, offset: number): Promise<Entry[]>;
  getEntry(id: number, userId: number): Promise<Entry | undefined>;
  updateEntry(id: number, userId: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number, userId: number): Promise<boolean>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private entriesMap: Map<number, Entry>;
  public sessionStore: session.SessionStore;
  private userId: number;
  private entryId: number;

  constructor() {
    this.users = new Map();
    this.entriesMap = new Map();
    this.userId = 1;
    this.entryId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.entryId++;
    const entry: Entry = {
      ...insertEntry,
      id,
      createdAt: new Date(),
    };
    this.entriesMap.set(id, entry);
    return entry;
  }

  async getEntries(userId: number, limit: number, offset: number): Promise<Entry[]> {
    const userEntries = Array.from(this.entriesMap.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return userEntries.slice(offset, offset + limit);
  }

  async getEntry(id: number, userId: number): Promise<Entry | undefined> {
    const entry = this.entriesMap.get(id);
    if (!entry || entry.userId !== userId) {
      return undefined;
    }
    return entry;
  }

  async updateEntry(id: number, userId: number, entryUpdate: Partial<InsertEntry>): Promise<Entry | undefined> {
    const entry = await this.getEntry(id, userId);
    if (!entry) {
      return undefined;
    }
    
    const updatedEntry: Entry = {
      ...entry,
      ...entryUpdate,
    };
    
    this.entriesMap.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEntry(id: number, userId: number): Promise<boolean> {
    const entry = await this.getEntry(id, userId);
    if (!entry) {
      return false;
    }
    
    return this.entriesMap.delete(id);
  }
}

export const storage = new MemStorage();
