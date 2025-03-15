import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExerciseSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all exercises for a user
  app.get("/api/exercises", async (req, res) => {
    try {
      // For demo purposes, using fixed user ID = 1
      const userId = 1;
      const exercises = await storage.getExercises(userId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exercises" });
    }
  });

  // Get a single exercise
  app.get("/api/exercises/:id", async (req, res) => {
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

  // Create a new exercise
  app.post("/api/exercises", async (req, res) => {
    try {
      // For demo purposes, using fixed user ID = 1
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
  app.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:5000');
  });
  
  // Update an exercise
  app.patch("/api/exercises/:id", async (req, res) => {
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

  // Delete an exercise
  app.delete("/api/exercises/:id", async (req, res) => {
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

  // Get exercise stats and summary for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      // For demo purposes, using fixed user ID = 1
      const userId = 1;
      const exercises = await storage.getExercises(userId);
      
      // Calculate stats from exercises
      const totalExercises = exercises.length;
      let totalCalories = 0;
      let totalDuration = 0; // in minutes
      
      // Get exercises for the current week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weeklyExercises = exercises.filter(ex => new Date(ex.date) >= startOfWeek);
      
      exercises.forEach(ex => {
        totalCalories += ex.calories || 0;
        
        // Convert duration to minutes for standardization
        if (ex.durationUnit === 'hr') {
          totalDuration += ex.duration * 60;
        } else {
          totalDuration += ex.duration;
        }
      });
      
      // Format for response
      const stats = {
        totalExercises,
        weeklyExercises: weeklyExercises.length,
        totalCalories,
        activeHours: Math.round(totalDuration / 60 * 10) / 10, // Round to 1 decimal place
        recentActivities: exercises.slice(0, 3) // Get 3 most recent activities
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exercise stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
