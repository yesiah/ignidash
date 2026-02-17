'use client';

import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CircleUserRoundIcon } from 'lucide-react';
import { MenuButton } from '@headlessui/react';

import { Dropdown } from '@/components/catalyst/dropdown';
import SidebarText from '@/components/layout/sidebar/sidebar-text';

import AccountDropdownMenu from './account-dropdown-menu';

export default function SidebarAuth() {
  const user = useQuery(api.auth.getCurrentUserSafe);
  const hasActiveSubscription = useQuery(api.auth.getHasActiveSubscription) ?? false;

  const name = user?.name ?? 'Anonymous';
  const email = user?.email;
  const image = user?.image;

  return (
    <Dropdown>
      <MenuButton
        aria-label="Account options"
        className="hover:bg-background border-border/50 focus-visible:ring-primary flex w-full items-center border-t py-3 pl-4 text-base/6 font-semibold focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        suppressHydrationWarning
      >
        {image ? (
          <Image alt="Profile pic" src={image} className="size-8 shrink-0 rounded-full" width={32} height={32} />
        ) : (
          <CircleUserRoundIcon className="size-8 shrink-0 rounded-full" />
        )}
        <SidebarText className="ml-2" aria-hidden="true">
          {name}
        </SidebarText>
      </MenuButton>
      <AccountDropdownMenu fetchedName={name} fetchedEmail={email} hasActiveSubscription={hasActiveSubscription} />
    </Dropdown>
  );
}
