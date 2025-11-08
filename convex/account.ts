import { v } from 'convex/values';
import { query } from './_generated/server';

import { getUserIdOrThrow } from './utils/auth-utils';
import { getPlanForUserIdOrThrow } from './utils/plan-utils';

export const getAccounts = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    return plan.accounts;
  },
});

export const getAccount = query({
  args: { planId: v.id('plans'), accountId: v.string() },
  handler: async (ctx, { planId, accountId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const account = plan.accounts.find((acc) => acc.id === accountId);
    return account || null;
  },
});

export const getSavingsAccount = query({
  args: { planId: v.id('plans'), accountId: v.string() },
  handler: async (ctx, { planId, accountId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const account = plan.accounts.find((acc) => acc.id === accountId && acc.type === 'savings');
    return account || null;
  },
});

export const getInvestmentAccount = query({
  args: { planId: v.id('plans'), accountId: v.string() },
  handler: async (ctx, { planId, accountId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const account = plan.accounts.find((acc) => acc.id === accountId && acc.type !== 'savings');
    return account || null;
  },
});
