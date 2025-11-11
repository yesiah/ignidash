'use client';

import Image from 'next/image';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'mobile-api',
    commit: '249df660',
    branch: 'main',
    date: '3h',
    dateTime: '2023-01-23T09:00',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '11464223',
    branch: 'main',
    date: '12h',
    dateTime: '2023-01-23T00:00',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'company-website',
    commit: 'dad28e95',
    branch: 'main',
    date: '2d',
    dateTime: '2023-01-21T13:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'relay-service',
    commit: '624bc94c',
    branch: 'main',
    date: '5d',
    dateTime: '2023-01-18T12:34',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'api.protocol.chat',
    commit: 'e111f80e',
    branch: 'main',
    date: '1w',
    dateTime: '2023-01-16T15:54',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'api.protocol.chat',
    commit: '5e136005',
    branch: 'main',
    date: '1w',
    dateTime: '2023-01-16T11:31',
  },
  {
    user: {
      name: 'Whitney Francis',
      imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '5c1fd07f',
    branch: 'main',
    date: '2w',
    dateTime: '2023-01-09T08:45',
  },
];

interface PlansListProps {
  preloadedPlans: Preloaded<typeof api.plans.listPlans>;
}

export default function PlansList({ preloadedPlans }: PlansListProps) {
  const plans = usePreloadedQuery(preloadedPlans);
  console.log('PlansList plans:', plans);

  return (
    <>
      <aside className="bg-zinc-50 lg:fixed lg:top-[4.3125rem] lg:right-0 lg:bottom-0 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-zinc-200 dark:bg-black/10 dark:lg:border-white/5">
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 dark:border-white/5">
          <h2 className="text-base/7 font-semibold text-zinc-900 dark:text-white">Activity feed</h2>
          <a href="#" className="text-sm/6 font-semibold text-rose-600 dark:text-rose-400">
            View all
          </a>
        </header>
        <ul role="list" className="divide-y divide-zinc-100 dark:divide-white/5">
          {activityItems.map((item) => (
            <li key={item.commit} className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-x-3">
                <Image
                  alt=""
                  src={item.user.imageUrl}
                  width={24}
                  height={24}
                  className="size-6 flex-none rounded-full bg-zinc-100 outline -outline-offset-1 outline-black/5 dark:bg-zinc-800 dark:outline-white/10"
                />
                <h3 className="flex-auto truncate text-sm/6 font-semibold text-zinc-900 dark:text-white">{item.user.name}</h3>
                <time dateTime={item.dateTime} className="flex-none text-xs text-zinc-500 dark:text-zinc-600">
                  {item.date}
                </time>
              </div>
              <p className="mt-3 truncate text-sm text-zinc-500">
                Pushed to <span className="text-zinc-700 dark:text-zinc-400">{item.projectName}</span> (
                <span className="font-mono text-zinc-700 dark:text-zinc-400">{item.commit}</span> on{' '}
                <span className="text-zinc-700 dark:text-zinc-400">{item.branch}</span>)
              </p>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
