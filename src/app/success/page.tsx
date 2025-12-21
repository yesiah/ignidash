import { Suspense } from 'react';

import PageLoading from '@/components/ui/page-loading';

import SubscriptionOverview, { type CustomerSubscription } from './subscription-overview';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string; customer_session_token?: string }>;
}) {
  const { customer_session_token: _customer_session_token } = await searchParams;

  const subscriptions: CustomerSubscription[] = [];
  const subscription = subscriptions[0];

  return (
    <Suspense fallback={<PageLoading ariaLabel="Loading subscription overview page" message="Loading" />}>
      <SubscriptionOverview subscription={subscription} />
    </Suspense>
  );
}
