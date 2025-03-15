import { users, type User, type InsertUser, exercises, type Exercise, type InsertExercise } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exercise CRUD
  getExercises(userId: number): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined>;
  deleteExercise(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  currentUserId: number;
  currentExerciseId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.currentUserId = 1;
    this.currentExerciseId = 1;
    
    // Add default user
    this.createUser({ username: "demo", password: "password" });
    
    // Add some sample exercises for demo user
    const demoUserId = 1;
    
    this.createExercise({
      userId: demoUserId,
      name: "Morning Jog",
      category: "cardio",
      duration: 30,
      durationUnit: "min",
      calories: 320,
      date: new Date(),
      notes: "Easy pace around the neighborhood"
    });
    
    this.createExercise({
      userId: demoUserId,
      name: "HIIT Workout",
      category: "hiit",
      duration: 25,
      durationUnit: "min",
      calories: 350,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      notes: "Interval training with 30 sec work, 15 sec rest"
    });
    
    this.createExercise({
      userId: demoUserId,
      name: "Weight Training",
      category: "strength",
      duration: 45,
      durationUnit: "min",
      calories: 280,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      notes: "Focus on chest and back"
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getExercises(userId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }
  
  async updateExercise(id: number, exerciseUpdate: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const exercise = this.exercises.get(id);
    if (!exercise) {
      return undefined;
    }
    
    const updatedExercise = { ...exercise, ...exerciseUpdate };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }
  
  async deleteExercise(id: number): Promise<boolean> {
    return this.exercises.delete(id);
  }
}

export const storage = new MemStorage();
