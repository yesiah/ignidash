import { z } from 'zod';

export const userFeedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback cannot be empty').max(1000, 'Feedback cannot be longer than 1000 characters'),
});

export type UserFeedbackInputs = z.infer<typeof userFeedbackSchema>;
