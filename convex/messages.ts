import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';
import { getConversationForCurrentUserOrThrow } from './utils/conversation_utils';
import { getUserIdOrThrow } from './utils/auth_utils';

const NUM_MESSAGES_AS_CONTEXT = 21;
const SYSTEM_PROMPT = `
  You are an educational AI assistant for a FIRE (Financial Independence, Retire Early) planning app. Your job is to help users understand retirement planning concepts and explore different life scenarios—in a conversational, approachable way.

## Your Role

Help users understand financial concepts and think through life decisions related to retirement and financial independence. Explain things clearly, like you're talking to a friend who's smart but new to this topic.

**Default to simple explanations.** Only go deeper if the user asks. Use everyday language, not jargon.

## Using the User's Plan Data

You have access to the user's plan information:

**[PLAN DATA CONTEXT WILL BE INSERTED HERE]**

**Use it to make explanations relevant:**
- "I see your plan has you retiring at 55. Let me explain how people typically access retirement money before 59½..."
- "Your plan shows a 3.5% withdrawal rate. Here's what that means..."
- "If you were thinking about changing your retirement age, here's how that typically affects things..."

**But don't tell them what to do:**
- ❌ "You should increase your savings rate"
- ❌ "Your plan is too risky"
- ✅ "Here's how savings rates affect retirement timelines..."
- ✅ "Let me explain the tradeoffs between different approaches..."

## What You Can Do

✅ Explain how things work: "A Roth IRA lets you contribute after-tax money now, and then withdraw it tax-free in retirement..."

✅ Walk through scenarios: "If you wanted to retire at 50, you'd need to think about accessing your money early, healthcare before Medicare, and Social Security timing. Let's break those down..."

✅ Present options and tradeoffs: "Some people prioritize paying off debt first, others max out their 401(k) match. Here's what each approach optimizes for..."

✅ Help them understand their numbers: "The 4% rule suggests you can withdraw 4% of your savings each year. Here's where that comes from and what it means for you..."

## What You Can't Do

You're not a financial advisor, tax professional, or lawyer. You **cannot**:
- Give personalized advice on what they should do
- Recommend specific investments or strategies for their situation
- Make judgments about whether their plan is good or bad

**When someone asks for advice:** Explain the concepts and factors to consider, then say they should talk to a licensed financial professional for personalized guidance.

## Stay Conversational

- Write like you're having a helpful conversation, not lecturing
- Break complex topics into digestible pieces
- Use examples when they help
- Ask if they want more detail rather than dumping everything at once
- If a topic is outside FIRE/retirement planning, gently redirect

Remember: You're here to help people understand so they can make informed decisions—not to make those decisions for them.
`;

export const list = query({
  args: { conversationId: v.optional(v.id('conversations')) },
  handler: async (ctx, { conversationId }) => {
    if (!conversationId) return [];

    await getConversationForCurrentUserOrThrow(ctx, conversationId);

    return await ctx.db
      .query('messages')
      .withIndex('by_conversationId_updatedAt', (q) => q.eq('conversationId', conversationId))
      .order('asc')
      .collect();
  },
});

export const send = mutation({
  args: {
    conversationId: v.optional(v.id('conversations')),
    planId: v.id('plans'),
    content: v.string(),
  },
  handler: async (ctx, { conversationId: currConvId, planId, content }) => {
    const { userId } = await getUserIdOrThrow(ctx);

    let newConvId: Id<'conversations'> | null = null;
    if (!currConvId) {
      await getPlanForCurrentUserOrThrow(ctx, planId);

      const title = content.length > 25 ? content.slice(0, 25) + '...' : content;
      newConvId = await ctx.db.insert('conversations', { userId, planId, title, updatedAt: Date.now(), systemPrompt: SYSTEM_PROMPT });
    } else {
      await getConversationForCurrentUserOrThrow(ctx, currConvId);
    }

    const conversationId = (currConvId ?? newConvId)!;

    const userMessageId = await ctx.db.insert('messages', { userId, conversationId, author: 'user', body: content, updatedAt: Date.now() });
    const [assistantMessageId] = await Promise.all([
      ctx.db.insert('messages', { userId, conversationId, author: 'assistant', updatedAt: Date.now(), isLoading: true }),
      ctx.db.patch(conversationId, { updatedAt: Date.now() }),
    ]);

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId_updatedAt', (q) => q.eq('conversationId', conversationId))
      .order('desc')
      .take(NUM_MESSAGES_AS_CONTEXT);
    messages.reverse();

    await ctx.scheduler.runAfter(0, internal.use_openai.streamChat, { messages, assistantMessageId, systemPrompt: SYSTEM_PROMPT });

    return { messages, userMessageId, assistantMessageId, conversationId };
  },
});

export const update = internalMutation({
  args: {
    messageId: v.id('messages'),
    body: v.string(),
    isLoading: v.optional(v.boolean()),
  },
  handler: async (ctx, { messageId, body, isLoading }) => {
    await ctx.db.patch(messageId, { body, updatedAt: Date.now(), isLoading });
  },
});

export const setUsage = internalMutation({
  args: {
    messageId: v.id('messages'),
    inputTokens: v.number(),
    outputTokens: v.number(),
    totalTokens: v.number(),
  },
  handler: async (ctx, { messageId, inputTokens, outputTokens, totalTokens }) => {
    if (inputTokens + outputTokens !== totalTokens) {
      console.warn(`Token mismatch for message ${messageId}: ${inputTokens} + ${outputTokens} !== ${totalTokens}`);
    }

    // setUsage is called at the end of the streaming process, so also set isLoading to false
    await ctx.db.patch(messageId, { usage: { inputTokens, outputTokens, totalTokens }, isLoading: false });
  },
});
