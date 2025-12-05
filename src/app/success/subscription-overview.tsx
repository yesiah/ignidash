import { FireIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { CustomerPortalCustomer } from '@polar-sh/sdk/models/components/customerportalcustomer.js';
import type { CustomerSubscription } from '@polar-sh/sdk/models/components/customersubscription.js';

interface SubscriptionOverviewProps {
  customer: CustomerPortalCustomer;
  subscription: CustomerSubscription;
}

export default function SubscriptionOverview({ customer, subscription }: SubscriptionOverviewProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <FireIcon className="text-primary mx-auto h-10 w-auto" />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-zinc-900 dark:text-white">Welcome to Ignidash Pro!</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="border-border/25 from-emphasized-background to-background border-y bg-gradient-to-bl px-6 py-12 shadow-sm sm:rounded-lg sm:border sm:px-12 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10">
            <div className="space-y-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:bg-rose-500 dark:hover:bg-rose-400 dark:focus-visible:outline-rose-500"
              >
                Visit Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p className="pb-6 text-center text-xs/6 text-zinc-500 dark:text-zinc-400">
        Questions? Read our{' '}
        <Link href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
