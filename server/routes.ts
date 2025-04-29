import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for tasks if needed in the future
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Pong! Server is running" });
  });

  // Serve notification sound
  app.get("/notification.mp3", (_req, res) => {
    // Using a simple beep sound
    const soundPath = path.join(__dirname, "..", "attached_assets", "notification.mp3");
    
    if (fs.existsSync(soundPath)) {
      res.sendFile(soundPath);
    } else {
      // Fallback to sending a 404 if file doesn't exist
      res.status(404).send("Sound file not found");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
