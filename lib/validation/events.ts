import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.enum(["tech", "culture", "sports", "workshop", "social"]),
  venue: z.string().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  registrationDeadline: z.coerce.date().optional(),
  capacity: z.coerce.number().int().min(0).default(0),
  tags: z.array(z.string()).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
