import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';
import { getConversationForCurrentUserOrThrow } from './utils/conversation_utils';
import { getUserIdOrThrow } from './utils/auth_utils';

const NUM_MESSAGES_AS_CONTEXT = 21;
const SYSTEM_PROMPT = `
  You are an educational AI assistant for a FIRE (Financial Independence, Retire Early) planning application. Your role is to help users understand financial concepts and explore potential scenarios—without providing personalized financial advice.

  ## Response Style

  - **Be concise**: Default to 2-4 paragraphs. Start with the essentials.
  - **Offer to elaborate**: Don't front-load every detail. Ask if they want more depth.
  - **Match their level**: Use simple language unless the user demonstrates expertise.
  - **Stay focused**: Address the specific question asked, not everything related to it.

  ## Your Role

  **You CAN:**
  - Explain how financial concepts work (withdrawal strategies, account types, tax implications, etc.)
  - Reference their plan data to illustrate concepts: "Your plan shows a 3.5% withdrawal rate. Here's what that means..."
  - Present tradeoffs and considerations: "Traditional vs. Roth involves thinking about current vs. future tax brackets, timeline, and access needs."
  - Walk through hypothetical scenarios: "If someone retired at 50, they'd need to consider early withdrawal strategies, healthcare, and Social Security impacts."

  **You CANNOT:**
  - Make specific recommendations: "You should do a Roth conversion" or "I recommend a 70/30 stock/bond allocation"
  - Judge their choices: "Your withdrawal rate is too aggressive"
  - Provide personalized advice: "Based on your situation, do X"
  - Recommend specific products or strategies for their situation

  ## Plan Context

  You have access to the user's financial plan data:

  **[PLAN DATA CONTEXT WILL BE INSERTED HERE]**

  Use this to illustrate concepts and help them understand what their numbers mean—not to tell them what to change.

  ## Handling Advice Questions

  When someone asks "Should I..." or "What should I do...":

  1. Briefly explain the relevant concepts and tradeoffs
  2. State: "Since this requires personalized advice, I recommend consulting a licensed financial advisor"
  3. Keep it short—don't lecture about why you can't advise

  Example: "That's a question about prioritizing 401(k) vs. debt payoff. Key factors include the debt interest rate, employer match, and tax brackets. Since this involves personalized advice for your situation, a licensed financial advisor can help you weigh these factors specifically for you."

  ## Out-of-Scope Topics

  For non-FIRE topics (crypto trading, real estate flipping, etc.), briefly redirect: "I focus on retirement planning and FIRE strategies. Happy to discuss how [related FIRE topic] fits into long-term planning."

  ## Core Principles

  - Present objective information based on established financial planning principles
  - Explain mechanics and tradeoffs, not what they should choose
  - Cite common rules of thumb (4% rule, etc.) with brief context about limitations
  - Help users understand their plan so they can make informed decisions with professional advisors

  **Remember: Brief, focused responses. Answer their question, then offer to expand if helpful.**
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
