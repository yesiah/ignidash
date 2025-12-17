import { z } from 'zod';

export const generateInsightsSchema = z.object({
  userPrompt: z.string().max(500, 'User prompt cannot be longer than 500 characters').optional(),
});

export type GenerateInsightsInputs = z.infer<typeof generateInsightsSchema>;
