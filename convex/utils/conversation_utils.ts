import { ConvexError } from 'convex/values';
import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Id, Doc } from '../_generated/dataModel';

import { getAllPlansForUser } from './plan_utils';

export async function getConversationForCurrentUserOrThrow(
  ctx: QueryCtx,
  conversationId: Id<'conversations'>
): Promise<Doc<'conversations'>> {
  const [identity, conversation] = await Promise.all([ctx.auth.getUserIdentity(), ctx.db.get(conversationId)]);

  const userId = identity?.subject;

  if (!conversation) throw new ConvexError('Conversation not found');
  if (conversation.userId !== userId) throw new ConvexError('Not authorized to access this conversation');

  return conversation;
}

export async function getAllConversationsForPlan(ctx: QueryCtx, planId: Id<'plans'>): Promise<Doc<'conversations'>[]> {
  return await ctx.db
    .query('conversations')
    .withIndex('by_planId_updatedAt', (q) => q.eq('planId', planId))
    .collect();
}

export async function deleteAllConversationsForPlan(ctx: MutationCtx, planId: Id<'plans'>): Promise<void> {
  const conversations = await getAllConversationsForPlan(ctx, planId);
  for (const conversation of conversations) {
    await ctx.db.delete(conversation._id);
  }
}

export async function deleteAllConversationsForUser(ctx: MutationCtx, userId: string): Promise<void> {
  const plans = await getAllPlansForUser(ctx, userId);
  for (const plan of plans) {
    await deleteAllConversationsForPlan(ctx, plan._id);
  }
}
