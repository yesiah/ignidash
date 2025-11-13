import { ConvexError } from 'convex/values';
import { QueryCtx } from '../_generated/server';
import type { Id, Doc } from '../_generated/dataModel';

export async function getPlanForUserIdOrThrow(ctx: QueryCtx, planId: Id<'plans'>, userId: string): Promise<Doc<'plans'>> {
  const plan = await ctx.db.get(planId);

  if (!plan) throw new ConvexError('Plan not found');
  if (plan.userId !== userId) throw new ConvexError('Not authorized to update this plan');

  return plan;
}
