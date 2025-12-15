import { v } from 'convex/values';

export const userFeedbackValidator = v.object({
  planId: v.id('plans'),
  feedback: v.string(),
});
