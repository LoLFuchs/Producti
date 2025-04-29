import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Task groups schema
export const taskGroups = pgTable("task_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertTaskGroupSchema = createInsertSchema(taskGroups).pick({
  name: true,
  color: true,
  userId: true,
});

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  groupId: integer("group_id").references(() => taskGroups.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  text: true,
  completed: true,
  groupId: true,
  userId: true,
});

// Timer settings schema
export const timerSettings = pgTable("timer_settings", {
  id: serial("id").primaryKey(),
  workTime: integer("work_time").notNull().default(25),
  shortBreakTime: integer("short_break_time").notNull().default(5),
  longBreakTime: integer("long_break_time").notNull().default(15),
  rounds: integer("rounds").notNull().default(4),
  userId: integer("user_id").references(() => users.id),
});

export const insertTimerSettingsSchema = createInsertSchema(timerSettings).pick({
  workTime: true,
  shortBreakTime: true,
  longBreakTime: true,
  rounds: true,
  userId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TaskGroup = typeof taskGroups.$inferSelect;
export type InsertTaskGroup = z.infer<typeof insertTaskGroupSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type TimerSetting = typeof timerSettings.$inferSelect;
export type InsertTimerSetting = z.infer<typeof insertTimerSettingsSchema>;
