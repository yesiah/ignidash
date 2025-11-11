'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import Card from '@/components/ui/card';

interface PlansListProps {
  preloadedPlans: Preloaded<typeof api.plans.listPlans>;
}

export default function PlansList({ preloadedPlans }: PlansListProps) {
  const plans = usePreloadedQuery(preloadedPlans);

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-5xl xl:max-w-7xl">
      <div className="flex w-full flex-col gap-2">
        {plans.map((plan) => (
          <Card key={plan._id} className="w-full">
            Plan Name: {plan.name}
          </Card>
        ))}
      </div>
    </div>
  );
}
