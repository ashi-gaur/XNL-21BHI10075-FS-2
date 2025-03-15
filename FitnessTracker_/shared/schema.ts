import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(),
  durationUnit: text("duration_unit").notNull(),
  calories: integer("calories"),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
});

export const workoutCategories = [
  { id: "cardio", name: "Cardio", icon: "ri-run-line" },
  { id: "strength", name: "Strength Training", icon: "ri-boxing-line" },
  { id: "flexibility", name: "Flexibility", icon: "ri-yoga-line" },
  { id: "hiit", name: "HIIT", icon: "ri-heart-pulse-line" },
  { id: "sports", name: "Sports", icon: "ri-basketball-line" },
  { id: "other", name: "Other", icon: "ri-fitness-line" }
];

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
