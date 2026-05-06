import { z } from "zod";

export const RESUME_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
export const RESUME_ALLOWED_MIME = ["application/pdf"];

export const resumeMetadataSchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(200)
    .regex(/\.pdf$/i, "Filename must end with .pdf"),
  notes: z.string().max(500).trim().optional(),
});

export type ResumeMetadata = z.infer<typeof resumeMetadataSchema>;
