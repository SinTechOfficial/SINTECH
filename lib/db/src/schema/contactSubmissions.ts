import { createInsertSchema } from "drizzle-zod";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  userAgent: text("user_agent"),
});

export const insertContactSubmissionSchema = createInsertSchema(
  contactSubmissionsTable,
).omit({
  id: true,
  status: true,
  createdAt: true,
  userAgent: true,
});

export type InsertContactSubmission = z.infer<
  typeof insertContactSubmissionSchema
>;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
