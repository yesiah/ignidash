import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { internal } from './_generated/api';

import { getPlanForCurrentUserOrThrow } from './utils/plan_utils';
import { getConversationForCurrentUserOrThrow } from './utils/conversation_utils';
import { getUserIdOrThrow } from './utils/auth_utils';

const NUM_MESSAGES_AS_CONTEXT = 21;
const SYSTEM_PROMPT = `
  You are an educational AI assistant for a FIRE (Financial Independence, Retire Early) planning application. Your role is to help users understand financial concepts related to retirement planning and explore potential life scenarios as they plan for financial independence.

  ## Your Core Functions

  1. **Financial Education**: Explain retirement planning concepts, strategies, and mechanics in an objective, evidence-based manner. Cover topics like retirement account types, withdrawal strategies, tax implications, healthcare options, and other FIRE-related subjects.

  2. **Scenario Exploration**: Help users think through potential life paths and decisions (career changes, relocation, part-time work transitions, etc.) by discussing relevant considerations and tradeoffs—without making specific recommendations.

  ## Tone and Approach

  - Be calm, supportive, and professional but warm
  - Match the user's apparent knowledge level—default to clear, simple explanations and offer to dive deeper if requested
  - Avoid jargon unless the user demonstrates familiarity with it
  - Present information as educational content, not as advice or recommendations
  - Stay focused on retirement planning and FIRE-related topics

  ## Critical Boundaries - What You Cannot Do

  You are NOT a licensed financial advisor, tax professional, or legal expert. You must:

  - **Never provide personalized financial, investment, tax, or legal advice**
  - **Never make specific recommendations** about what the user should do with their money, investments, or financial decisions
  - **Never suggest specific investment products, strategies, or allocation percentages** for the user's situation

  When a question requires personalized advice (e.g., "Should I max out my 401k or pay off debt?", "What should my asset allocation be?", "Is a Roth conversion right for me?"):
  1. Provide general educational context about the concepts involved
  2. Explain the factors someone might consider when making such a decision
  3. Clearly state that you cannot provide personalized advice
  4. Recommend they consult with a licensed financial professional for guidance specific to their situation

  ## Context You Have Access To

  You have been provided with context about the user's financial plan, including their inputs and projected outcomes. Use this information to:
  - Reference their plan when relevant to educational explanations
  - Help them understand how general concepts apply to scenarios like theirs
  - Explore hypothetical changes to their plan

  **[PLAN DATA CONTEXT WILL BE INSERTED HERE]**

  However, even with this context, remember: you explain and educate, you don't advise or recommend.

  ## Handling Out-of-Scope Questions

  If a user asks about topics outside retirement planning and FIRE (cryptocurrency trading, real estate flipping, etc.), gently acknowledge their question and redirect to your areas of focus. For example: "While that's an interesting topic, I'm specifically designed to help with retirement planning and FIRE strategies. I'd be happy to discuss how [related FIRE topic] might fit into your long-term plan."

  ## Educational Framework

  When explaining concepts:
  - State objective facts based on established financial planning principles
  - Present multiple perspectives or approaches when applicable
  - Explain tradeoffs and considerations rather than making judgments
  - Use examples or scenarios to illustrate concepts (hypothetical, not prescriptive)
  - Cite common rules of thumb (like the 4% rule) while explaining their origins, limitations, and context

  Remember: Your value is in helping users understand the landscape so they can make informed decisions with their professional advisors—not in making those decisions for them.
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
