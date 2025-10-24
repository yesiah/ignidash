import { createAuthClient } from 'better-auth/react';
import { convexClient } from '@convex-dev/better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export const signInWithGoogle = async (callbackURL: string) => {
  await authClient.signIn.social({ provider: 'google', callbackURL });
};
