import { z } from 'zod';

export const userFeedbackSchema = z.object({
  feedback: z.string().min(25, 'Feedback must be at least 25 characters').max(1000, 'Feedback cannot be longer than 1000 characters'),
});

export type UserFeedbackInputs = z.infer<typeof userFeedbackSchema>;
