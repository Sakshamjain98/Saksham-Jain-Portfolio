import { z } from "zod";

export const blogPostInputSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, digits, and hyphens only")
    .trim(),
  title: z.string().min(1).max(240).trim(),
  excerpt: z.string().min(1).max(500).trim(),
  contentMdx: z.string().min(1),
  coverImage: z.string().optional(),
  tags: z.array(z.string().trim().toLowerCase()).default([]),
  category: z.string().trim().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  authorEmail: z.string().email().toLowerCase().trim(),
  authorName: z.string().trim().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().max(240).trim().optional(),
  seoDescription: z.string().max(500).trim().optional(),
  ogImage: z.string().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
