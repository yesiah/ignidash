import { z } from 'zod';

export const taxSettingsSchema = z.object({
  filingStatus: z.enum(['single', 'marriedFilingJointly', 'headOfHousehold']),
});

export type TaxSettingsInputs = z.infer<typeof taxSettingsSchema>;
