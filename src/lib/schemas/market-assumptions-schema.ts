import { z } from 'zod';

import { percentageField } from '@/lib/utils/zod-schema-helpers';

export const marketAssumptionsSchema = z.object({
  stockReturn: percentageField(0, 20, 'Stock return'),
  bondReturn: percentageField(0, 15, 'Bond return'),
  cashReturn: percentageField(0, 10, 'Cash return'),
  inflationRate: percentageField(0, 8, 'Inflation rate'),
});

export type MarketAssumptionsInputs = z.infer<typeof marketAssumptionsSchema>;
