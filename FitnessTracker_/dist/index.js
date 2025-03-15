// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  exercises;
  currentUserId;
  currentExerciseId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.exercises = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentExerciseId = 1;
    this.createUser({ username: "demo", password: "password" });
    const demoUserId = 1;
    this.createExercise({
      userId: demoUserId,
      name: "Morning Jog",
      category: "cardio",
      duration: 30,
      durationUnit: "min",
      calories: 320,
      date: /* @__PURE__ */ new Date(),
      notes: "Easy pace around the neighborhood"
    });
    this.createExercise({
      userId: demoUserId,
      name: "HIIT Workout",
      category: "hiit",
      duration: 25,
      durationUnit: "min",
      calories: 350,
      date: new Date(Date.now() - 24 * 60 * 60 * 1e3),
      // yesterday
      notes: "Interval training with 30 sec work, 15 sec rest"
    });
    this.createExercise({
      userId: demoUserId,
      name: "Weight Training",
      category: "strength",
      duration: 45,
      durationUnit: "min",
      calories: 280,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
      // 2 days ago
      notes: "Focus on chest and back"
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getExercises(userId) {
    return Array.from(this.exercises.values()).filter((exercise) => exercise.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async getExercise(id) {
    return this.exercises.get(id);
  }
  async createExercise(insertExercise) {
    const id = this.currentExerciseId++;
    const exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }
  async updateExercise(id, exerciseUpdate) {
    const exercise = this.exercises.get(id);
    if (!exercise) {
      return void 0;
    }
    const updatedExercise = { ...exercise, ...exerciseUpdate };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }
  async deleteExercise(id) {
    return this.exercises.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(),
  durationUnit: text("duration_unit").notNull(),
  calories: integer("calories"),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.get("/api/exercises", async (req, res) => {
    try {
      const userId = 1;
      const exercises2 = await storage.getExercises(userId);
      res.json(exercises2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exercises" });
    }
  });
  app2.get("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exercise ID" });
      }
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exercise" });
    }
  });
  app2.post("/api/exercises", async (req, res) => {
    try {
      const userId = 1;
      const data = { ...req.body, userId };
      const validatedData = insertExerciseSchema.parse(data);
      const exercise = await storage.createExercise(validatedData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });
  app2.listen(5e3, "0.0.0.0", () => {
    console.log("Server is running on http://0.0.0.0:5000");
  });
  app2.patch("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exercise ID" });
      }
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      const updatedExercise = await storage.updateExercise(id, req.body);
      res.json(updatedExercise);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });
  app2.delete("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid exercise ID" });
      }
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      const deleted = await storage.deleteExercise(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete exercise" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const userId = 1;
      const exercises2 = await storage.getExercises(userId);
      const totalExercises = exercises2.length;
      let totalCalories = 0;
      let totalDuration = 0;
      const today = /* @__PURE__ */ new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const weeklyExercises = exercises2.filter((ex) => new Date(ex.date) >= startOfWeek);
      exercises2.forEach((ex) => {
        totalCalories += ex.calories || 0;
        if (ex.durationUnit === "hr") {
          totalDuration += ex.duration * 60;
        } else {
          totalDuration += ex.duration;
        }
      });
      const stats = {
        totalExercises,
        weeklyExercises: weeklyExercises.length,
        totalCalories,
        activeHours: Math.round(totalDuration / 60 * 10) / 10,
        // Round to 1 decimal place
        recentActivities: exercises2.slice(0, 3)
        // Get 3 most recent activities
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exercise stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
