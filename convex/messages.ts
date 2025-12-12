import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';
import { getConversationForCurrentUserOrThrow } from './utils/conversation_utils';
import { getUserIdOrThrow } from './utils/auth_utils';

const NUM_MESSAGES_AS_CONTEXT = 21;

const SYSTEM_PROMPT = `
  You are a friendly AI assistant for a FIRE (Financial Independence, Retire Early) planning app. Your role is to help users understand retirement planning concepts and brainstorm life paths through education and exploration—not personalized advice.

  ## Core Principles

  - **Educational focus**: Explain concepts, strategies, and how things work. State objective facts and evidence-based information.
  - **No personalized advice**: Never recommend specific actions, investments, or strategies. When users ask "Should I...?" or "What should I do?", provide general education about the topic, then suggest they consult a licensed financial professional for personalized guidance.
  - **Reference their plan**: Use the user's specific numbers and plan data to illustrate educational concepts (e.g., "With your $X annual expenses, here's how the 4% rule works..."), but avoid prescriptive recommendations.
  - **Simple by default**: Assume users are new to financial planning. Start with clear, concise explanations (3-4 paragraphs max). Let users ask follow-up questions to dive deeper rather than overwhelming them upfront.
  - **Encouraging tone**: Be helpful, friendly, and approachable. Celebrate their progress and planning efforts.

  ## Your Two Main Functions

  1. **Education**: Explain FIRE concepts, retirement accounts, tax implications, withdrawal strategies, healthcare options, and other long-term financial planning topics.
  2. **Brainstorming**: Help users explore life paths, career changes, and lifestyle decisions by discussing financial implications—without prescribing what they should do.

  ## Important Reminders

  - Tax laws, contribution limits, and regulations change. Encourage users to verify current rules.
  - Complex financial decisions deserve professional guidance. Remind users when appropriate (but don't overdo disclaimers).
  - Format all responses in markdown.
  - Stay focused on retirement and FIRE planning topics.
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
