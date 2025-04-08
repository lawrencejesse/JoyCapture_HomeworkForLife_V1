import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { insertEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Journal entry API endpoints
  app.post("/api/entries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const entryData = insertEntrySchema.parse({
        ...req.body,
        userId: req.user!.id,
      });

      const entry = await storage.createEntry(entryData);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid entry data",
          errors: err.errors,
        });
      }
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  app.get("/api/entries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    try {
      const entries = await storage.getEntries(req.user!.id, limit, offset);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  app.get("/api/entries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = Number(req.params.id);
      const entry = await storage.getEntry(id, req.user!.id);
      
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(entry);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  app.put("/api/entries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = Number(req.params.id);
      const entryData = insertEntrySchema.partial().parse(req.body);
      
      const updatedEntry = await storage.updateEntry(id, req.user!.id, entryData);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid entry data",
          errors: err.errors,
        });
      }
      res.status(500).json({ message: "Failed to update entry" });
    }
  });

  app.delete("/api/entries/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const id = Number(req.params.id);
      const success = await storage.deleteEntry(id, req.user!.id);
      
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }
      
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
