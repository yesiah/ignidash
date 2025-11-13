import { v } from 'convex/values';

export const taxSettingsValidator = v.object({
  filingStatus: v.union(v.literal('single'), v.literal('marriedFilingJointly'), v.literal('headOfHousehold')),
});
