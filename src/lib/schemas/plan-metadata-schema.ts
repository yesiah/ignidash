import { z } from 'zod';

export const planMetadataSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  clonedPlanId: z.string().optional(),
});

export type PlanMetadata = z.infer<typeof planMetadataSchema>;
