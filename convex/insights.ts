import { v, ConvexError } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';

import { getUserIdOrThrow } from './utils/auth_utils';
import { recordUsage, getCanUseChat } from './utils/ai_utils';
import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';

export const get = query({
  args: {
    planId: v.id('plans'),
  },
  handler: async (ctx, { planId }) => {
    await getPlanForCurrentUserOrThrow(ctx, planId);

    return await ctx.db
      .query('insights')
      .withIndex('by_planId_updatedAt', (q) => q.eq('planId', planId))
      .order('desc')
      .first();
  },
});

export const generate = mutation({
  args: {
    planId: v.id('plans'),
  },
  handler: async (ctx, { planId }) => {
    const [{ userId: _userId }, canUseChat] = await Promise.all([getUserIdOrThrow(ctx), getCanUseChat(ctx)]);

    if (!canUseChat) throw new ConvexError('AI insights are not available. Upgrade to start generating insights.');

    throw new ConvexError('Not implemented');
  },
});

export const setContent = internalMutation({
  args: {
    insightId: v.id('insights'),
    content: v.string(),
    isLoading: v.optional(v.boolean()),
  },
  handler: async (ctx, { insightId, content, isLoading }) => {
    const updates: { content: string; updatedAt: number; isLoading?: boolean } = { content, updatedAt: Date.now() };
    if (isLoading !== undefined) updates.isLoading = isLoading;

    await ctx.db.patch(insightId, updates);
  },
});

export const setUsage = internalMutation({
  args: {
    insightId: v.id('insights'),
    userId: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    totalTokens: v.number(),
  },
  handler: async (ctx, { insightId, userId, inputTokens, outputTokens, totalTokens }) => {
    if (inputTokens + outputTokens !== totalTokens) {
      console.warn(`Token mismatch for insight ${insightId}: ${inputTokens} + ${outputTokens} !== ${totalTokens}`);
    }

    await Promise.all([
      ctx.db.patch(insightId, { usage: { inputTokens, outputTokens, totalTokens }, updatedAt: Date.now() }),
      recordUsage(ctx, userId, inputTokens, outputTokens),
    ]);
  },
});

export const setIsLoading = internalMutation({
  args: {
    insightId: v.id('insights'),
    isLoading: v.boolean(),
  },
  handler: async (ctx, { insightId, isLoading }) => {
    await ctx.db.patch(insightId, { isLoading, updatedAt: Date.now() });
  },
});
