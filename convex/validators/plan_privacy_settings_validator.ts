import { v } from 'convex/values';

export const planPrivacySettingsValidator = v.object({
  isPrivate: v.boolean(),
});
