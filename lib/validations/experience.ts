import { z } from "zod";

export const experienceInputSchema = z.object({
  title: z.string().min(1).max(160).trim(),
  company: z.string().min(1).max(160).trim(),
  description: z.string().min(1).max(2000).trim(),
  location: z.string().max(160).trim().optional().or(z.literal("")),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  order: z.number().int().min(0).default(0),
  thumbnail: z.string().optional(),
  highlights: z.array(z.string().trim()).default([]),
  technologies: z.array(z.string().trim()).default([]),
});

export type ExperienceInput = z.infer<typeof experienceInputSchema>;
