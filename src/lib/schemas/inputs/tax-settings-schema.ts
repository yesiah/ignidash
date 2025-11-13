import { z } from 'zod';

const filingStatus = z.enum(['single', 'marriedFilingJointly', 'headOfHousehold']);

export type FilingStatus = z.infer<typeof filingStatus>;

export const taxSettingsSchema = z.object({
  filingStatus,
});

export type TaxSettingsInputs = z.infer<typeof taxSettingsSchema>;
