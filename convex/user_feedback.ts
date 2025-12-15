import { mutation } from './_generated/server';

import { userFeedbackValidator } from './validators/user_feedback_validator';
import { getUserIdOrThrow } from './utils/auth_utils';

export const send = mutation({
  args: {
    feedback: userFeedbackValidator,
  },
  handler: async (ctx, { feedback: { planId, feedback } }) => {
    const { userId } = await getUserIdOrThrow(ctx);
    await ctx.db.insert('userFeedback', { userId, feedback: { planId, feedback } });
  },
});
