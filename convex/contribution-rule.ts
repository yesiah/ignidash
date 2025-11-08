import { v } from 'convex/values';
import { query } from './_generated/server';

import { getUserIdOrThrow } from './utils/auth-utils';
import { getPlanForUserIdOrThrow } from './utils/plan-utils';

export const getContributionRules = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    return plan.contributionRules;
  },
});

export const getContributionRule = query({
  args: { planId: v.id('plans'), ruleId: v.string() },
  handler: async (ctx, { planId, ruleId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    const rule = plan.contributionRules.find((rule) => rule.id === ruleId);
    return rule || null;
  },
});

export const getBaseContributionRule = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, { planId }) => {
    const userId = await getUserIdOrThrow(ctx);
    const plan = await getPlanForUserIdOrThrow(ctx, planId, userId);

    return plan.baseContributionRule;
  },
});
