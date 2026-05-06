import { z } from "zod";

export const projectSectionSchema = z.object({
  kind: z.enum([
    "overview",
    "problem",
    "architecture",
    "stack",
    "scaling",
    "challenges",
    "outcomes",
    "custom",
  ]),
  heading: z.string().min(1).max(160).trim(),
  body: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, digits, and hyphens only")
    .trim(),
  title: z.string().min(1).max(160).trim(),
  tagline: z.string().min(1).max(240).trim(),
  description: z.string().min(1).max(4000).trim(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  iconLists: z.array(z.string()).default([]),
  status: z.enum(["live", "in-development", "private"]).default("live"),
  isFeatured: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  technologies: z.array(z.string().trim()).default([]),
  sections: z.array(projectSectionSchema).default([]),
  publishedAt: z.coerce.date().optional(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
