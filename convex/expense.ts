import { v } from 'convex/values';
import { query } from './_generated/server';

import { getUserIdOrThrow } from './utils/auth-utils';
import { getPlanForUserIdOrThrow } from './utils/plan-utils';

export const getExpenses = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    return plan.expenses;
  },
});

export const getExpense = query({
  args: { planId: v.id('plans'), expenseId: v.string() },
  handler: async (ctx, { planId, expenseId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const expense = plan.expenses.find((exp) => exp.id === expenseId);
    return expense || null;
  },
});
