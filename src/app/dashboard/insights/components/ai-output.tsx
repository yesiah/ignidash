'use client';

import Link from 'next/link';

import { Heading } from '@/components/catalyst/heading';
import { useInsightsSelectedPlan } from '@/lib/stores/simulator-store';

export default function AIOutput() {
  const selectedPlan = useInsightsSelectedPlan();

  return (
    <div className="-mx-2 h-full sm:-mx-3 lg:-mx-4 lg:pr-96">
      <header className="from-emphasized-background to-background border-border/50 flex items-center justify-between border-b bg-gradient-to-l px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {selectedPlan ? (
          <Heading level={3}>
            Insights for{' '}
            <Link
              href={`/dashboard/simulator/${selectedPlan?.id}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedPlan?.name}
            </Link>
          </Heading>
        ) : (
          <Heading level={3}>
            Select a plan <span aria-hidden="true">&rarr;</span>
          </Heading>
        )}
      </header>
      <div className="flex h-full flex-col items-center justify-center">AI Output</div>
    </div>
  );
}
