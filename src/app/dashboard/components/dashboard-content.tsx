import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

import { getToken } from '@/lib/auth-server';

import PlansList from './plans-list';
import PlansListV2 from './plans-list-v2';

export default async function DashboardContent() {
  const token = await getToken();
  if (!token) throw new Error('User not authenticated');

  const preloadedPlans = await preloadQuery(api.plans.listPlans, {}, { token });
  if (false) return <PlansList preloadedPlans={preloadedPlans} />;
  return <PlansListV2 />;
}
