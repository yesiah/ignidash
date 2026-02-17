import { v } from 'convex/values';

export const privacySettingsValidator = v.object({
  isPrivate: v.boolean(),
});
