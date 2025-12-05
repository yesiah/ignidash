import { FireIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { CustomerPortalCustomer } from '@polar-sh/sdk/models/components/customerportalcustomer.js';

interface SubscriptionOverviewProps {
  customer: CustomerPortalCustomer;
}

export default function SubscriptionOverview({ customer }: SubscriptionOverviewProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <FireIcon className="text-primary mx-auto h-10 w-auto" />
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-zinc-900 dark:text-white">Welcome to Ignidash Pro!</h2>
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
