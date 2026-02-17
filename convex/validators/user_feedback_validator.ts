import { v } from 'convex/values';

export const userFeedbackValidator = v.object({
  planId: v.optional(v.id('plans')),
  pathname: v.string(),
  feedback: v.string(),
});
