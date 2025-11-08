import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { authComponent } from './auth';

import { contributionRulesValidator } from './validators/contribution-rules-validator';

export const upsertContributionRule = mutation({
  args: {
    planId: v.id('plans'),
    contributionRule: contributionRulesValidator,
  },
  handler: async (ctx, { planId, contributionRule }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const userId = user?._id;

    if (!userId) throw new Error('User not authenticated');

    const plan = await ctx.db.get(planId);

    if (!plan) throw new Error('Plan not found');
    if (plan.userId !== userId) throw new Error('Not authorized to update this plan');

    const updatedContributionRules = [...plan.contributionRules.filter((cr) => cr.id !== contributionRule.id), contributionRule];

    await ctx.db.patch(planId, { contributionRules: updatedContributionRules });
  },
});

export const reorderContributionRules = mutation({
  args: {
    planId: v.id('plans'),
    newOrder: v.array(v.string()),
  },
  handler: async (ctx, { planId, newOrder }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const userId = user?._id;

    if (!userId) throw new Error('User not authenticated');

    const plan = await ctx.db.get(planId);

    if (!plan) throw new Error('Plan not found');
    if (plan.userId !== userId) throw new Error('Not authorized to update this plan');

    const reorderedContributionRules = newOrder.map((id, index) => {
      const cr = plan.contributionRules.find((c) => c.id === id);
      if (!cr) throw new Error(`Contribution rule ${id} not found`);
      return { ...cr, rank: index + 1 };
    });

    await ctx.db.patch(planId, { contributionRules: reorderedContributionRules });
  },
});

export const deleteContributionRule = mutation({
  args: {
    planId: v.id('plans'),
    contributionRuleId: v.string(),
  },
  handler: async (ctx, { planId, contributionRuleId }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const userId = user?._id;

    if (!userId) throw new Error('User not authenticated');

    const plan = await ctx.db.get(planId);

    if (!plan) throw new Error('Plan not found');
    if (plan.userId !== userId) throw new Error('Not authorized to update this plan');

    const updatedContributionRules = plan.contributionRules
      .filter((rule) => rule.id !== contributionRuleId)
      .map((rule, idx) => ({ ...rule, rank: idx + 1 }));

    await ctx.db.patch(planId, { contributionRules: updatedContributionRules });
  },
});
