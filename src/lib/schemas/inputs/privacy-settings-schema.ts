import { z } from 'zod';

export const privacySettingsSchema = z.object({
  isPrivate: z.boolean(),
});

export type PrivacySettingsInputs = z.infer<typeof privacySettingsSchema>;
