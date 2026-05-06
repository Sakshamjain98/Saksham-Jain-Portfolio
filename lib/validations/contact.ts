import { z } from "zod";

export const contactInputSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(80, "First name is too long")
    .trim(),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name is required")
    .max(80, "Last name is too long")
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email")
    .max(254, "Email is too long")
    .toLowerCase()
    .trim(),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Tell me a little more — at least 10 characters")
    .max(4000, "Message is too long (4000 chars max)")
    .trim(),
  // Honeypot — bots fill it; humans don't see it. We accept any value but
  // treat non-empty as spam in the route handler.
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
