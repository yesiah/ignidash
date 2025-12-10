import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';
import { getConversationForCurrentUserOrThrow } from './utils/conversation_utils';

export const list = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    await getPlanForCurrentUserOrThrow(ctx, planId);

    return await ctx.db
      .query('conversations')
      .withIndex('by_planId_updatedAt', (q) => q.eq('planId', planId))
      .order('asc')
      .collect();
  },
});

export const get = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, { conversationId }) => {
    return getConversationForCurrentUserOrThrow(ctx, conversationId);
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, { conversationId }) => {
    await getConversationForCurrentUserOrThrow(ctx, conversationId);

    await ctx.db.delete(conversationId);

    const messagesToDelete = await ctx.db
      .query('messages')
      .withIndex('by_conversationId_updatedAt', (q) => q.eq('conversationId', conversationId))
      .collect();

    for (const message of messagesToDelete) {
      await ctx.db.delete(message._id);
    }
  },
});
