import { QueryCtx, MutationCtx } from '../_generated/server';
import type { Doc } from '../_generated/dataModel';

export async function getFinancesForUser(ctx: QueryCtx, userId: string): Promise<Doc<'finances'> | null> {
  return await ctx.db
    .query('finances')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .first();
}

export async function deleteFinancesForUser(ctx: MutationCtx, userId: string): Promise<void> {
  const finances = await getFinancesForUser(ctx, userId);
  if (finances) await ctx.db.delete(finances._id);
}
