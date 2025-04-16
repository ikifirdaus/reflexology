import { z } from "zod";

export const FeedbackSchema = z.object({
  therapistId: z.string(),
  name: z.string().min(1),
  contact: z.string().min(1),
  cleanliness: z.number().int().min(1).max(5),
  politeness: z.number().int().min(1).max(5),
  pressure: z.number().int().min(1).max(5),
  punctuality: z.number().int().min(1).max(5),
  totalScore: z.number().int(),
});
