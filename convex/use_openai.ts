'use node';

import { AzureOpenAI } from 'openai';
import { action } from './_generated/server';
import type { Id, Doc } from './_generated/dataModel';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is not set.');

const endpoint = process.env.OPENAI_ENDPOINT;
if (!endpoint) throw new Error('OPENAI_ENDPOINT environment variable is not set.');

const openai = new AzureOpenAI({
  endpoint,
  apiKey,
  deployment: 'gpt-5-mini',
  apiVersion: '2024-04-01-preview',
});

type StreamChatParams = {
  messages: Doc<'messages'>[];
  assistantMessageId: Id<'messages'>;
};

export const streamChat = action({
  handler: async (ctx, { messages, assistantMessageId }: StreamChatParams) => {
    const hasBody = (msg: Doc<'messages'>): msg is Doc<'messages'> & { body: string } => msg.body !== undefined;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: "You are a terse bot in a group chat responding to q's." },
          ...messages.filter(hasBody).map((msg) => ({ role: msg.author, content: msg.body })),
        ],
        stream: true,
      });

      return completion;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to get a streaming response from OpenAI: ${error}`);
    }
  },
});
