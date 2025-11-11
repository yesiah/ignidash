'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface PlansListProps {
  preloadedPlans: Preloaded<typeof api.plans.listPlans>;
}

export default function PlansList({ preloadedPlans }: PlansListProps) {
  const plans = usePreloadedQuery(preloadedPlans);

  return (
    <div>
      {plans.map((plan) => (
        <div key={plan._id}>{plan.name}</div>
      ))}
    </div>
  );
}
