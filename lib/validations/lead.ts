import { z } from "zod";

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "won",
  "archived",
  "spam",
]);

export const leadPrioritySchema = z.enum(["low", "medium", "high"]);

export const leadUpdateSchema = z.object({
  status: leadStatusSchema.optional(),
  priority: leadPrioritySchema.optional(),
  category: z.string().trim().optional(),
});

export const leadNoteSchema = z.object({
  body: z.string().min(1).max(4000).trim(),
});

export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
export type LeadNoteInput = z.infer<typeof leadNoteSchema>;
