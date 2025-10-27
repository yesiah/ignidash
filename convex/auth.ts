import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { requireActionCtx } from '@convex-dev/better-auth/utils';
import { Resend } from '@convex-dev/resend';
import { betterAuth } from 'better-auth';

import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';

const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth);
export const resend = new Resend(components.resend, { testMode: false });

export const createAuth = (ctx: GenericCtx<DataModel>, { optionsOnly } = { optionsOnly: false }) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await resend.sendEmail(requireActionCtx(ctx), {
          from: 'Ignidash <noreply@mail.ignidash.com>',
          to: user.email,
          subject: 'Reset your password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <p style="font-size: 16px; color: #333; line-height: 1.5;">
                Click the link below to reset your password:
              </p>
              <p style="margin: 30px 0;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #f43f5e; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 600;">Reset Password</a>
              </p>
            </div>
          `,
        });
      },
      onPasswordReset: async ({ user }, request) => {
        console.log(`Password for user ${user.email} has been reset.`);
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
          await resend.sendEmail(requireActionCtx(ctx), {
            from: 'Ignidash <noreply@mail.ignidash.com>',
            to: user.email,
            subject: 'Approve email change',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <p style="font-size: 16px; color: #333; line-height: 1.5;">
                  You've requested to change your email address to <strong>${newEmail}</strong>.
                </p>
                <p style="font-size: 16px; color: #333; line-height: 1.5;">
                  Click the link below to approve this change:
                </p>
                <p style="margin: 30px 0;">
                  <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #f43f5e; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 600;">Approve Email Change</a>
                </p>
              </div>
            `,
          });
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [convex()],
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await resend.sendEmail(requireActionCtx(ctx), {
          from: 'Ignidash <noreply@mail.ignidash.com>',
          to: user.email,
          subject: 'Verify your email address',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <p style="font-size: 16px; color: #333; line-height: 1.5;">
                Click the link below to verify your email:
              </p>
              <p style="margin: 30px 0;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #f43f5e; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 600;">Verify Email</a>
              </p>
            </div>
          `,
        });
      },
      sendOnSignUp: true,
    },
  });
};

export const getCurrentUserSafe = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});

export const getUserSettingsCapabilities = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser)
      return {
        isSignedInWithSocialProvider: false,
        canChangeEmail: false,
        canChangePassword: false,
        canChangeName: false,
        isEmailVerified: false,
      };

    try {
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
      const accounts = await auth.api.listUserAccounts({ headers, method: 'GET' });

      const isSignedInWithSocialProvider = accounts.some((account) => account.providerId !== 'credential');

      return {
        isSignedInWithSocialProvider,
        canChangeEmail: !isSignedInWithSocialProvider,
        canChangePassword: !isSignedInWithSocialProvider,
        canChangeName: true,
        isEmailVerified: authUser.emailVerified,
      };
    } catch (error) {
      console.error('Error fetching user accounts:', error);

      return {
        isSignedInWithSocialProvider: false,
        canChangeEmail: true,
        canChangePassword: true,
        canChangeName: true,
        isEmailVerified: authUser.emailVerified,
      };
    }
  },
});
