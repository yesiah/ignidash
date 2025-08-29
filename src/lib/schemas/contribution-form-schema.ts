import { z } from 'zod';
import { currencyFieldForbidsZero, percentageField } from '@/lib/utils/zod-schema-helpers';

const baseContributionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  rank: z.number().int().min(0),
  maxValue: currencyFieldForbidsZero('Max value must be greater than zero').optional(),
  incomeIds: z.array(z.string()).optional(),
});

export const contributionFormSchema = z.discriminatedUnion('allocationType', [
  z.object({
    ...baseContributionSchema.shape,
    allocationType: z.literal('fixed'),
    amount: currencyFieldForbidsZero('Amount must be greater than zero'),
  }),

  z.object({
    ...baseContributionSchema.shape,
    allocationType: z.literal('percentageRemaining'),
    amount: percentageField(0, 100, 'Percentage of remaining funds'),
  }),

  z.object({
    ...baseContributionSchema.shape,
    allocationType: z.literal('unlimited'),
  }),
]);

export type ContributionInputs = z.infer<typeof contributionFormSchema>;
