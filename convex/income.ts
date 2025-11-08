import { v } from 'convex/values';
import { query } from './_generated/server';

import { getUserIdOrThrow } from './utils/auth-utils';
import { getPlanForUserIdOrThrow } from './utils/plan-utils';

export const getIncomes = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    return plan.incomes;
  },
});

export const getIncome = query({
  args: { planId: v.id('plans'), incomeId: v.string() },
  handler: async (ctx, { planId, incomeId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const income = plan.incomes.find((inc) => inc.id === incomeId);
    return income || null;
  },
});
