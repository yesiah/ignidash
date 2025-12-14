import { v } from 'convex/values';

export const keyMetricsValidator = v.object({
  success: v.number(),
  startAge: v.number(),
  retirementAge: v.union(v.number(), v.null()),
  yearsToRetirement: v.union(v.number(), v.null()),
  bankruptcyAge: v.union(v.number(), v.null()),
  yearsToBankruptcy: v.union(v.number(), v.null()),
  portfolioAtRetirement: v.union(v.number(), v.null()),
  lifetimeTaxesAndPenalties: v.number(),
  finalPortfolio: v.number(),
  progressToRetirement: v.union(v.number(), v.null()),
  areValuesMeans: v.boolean(),
});
