import { ConvexError } from 'convex/values';
import type { QueryCtx } from '../_generated/server';

export async function getUserIdOrThrow(ctx: QueryCtx): Promise<{ userId: string; userName: string }> {
  const identity = await ctx.auth.getUserIdentity();
  const userId = identity?.subject;

  if (!userId) throw new ConvexError('User not authenticated');

  return { userId, userName: identity.name || 'Anonymous' };
}
