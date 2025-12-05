import { Webhooks } from '@polar-sh/nextjs';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCustomerStateChanged: async (payload) => {
    console.log('Customer state changed webhook received:', payload);
  },
  onOrderPaid: async (payload) => {
    console.log('Order paid webhook received:', payload);
  },
  onPayload: async (payload) => {
    console.log('Generic webhook payload received:', payload);
  },
});
