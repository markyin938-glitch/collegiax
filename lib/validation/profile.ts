import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  college: z.string().min(2, "College is required"),
  department: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  rollNumber: z.string().optional().nullable(),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
