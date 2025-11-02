'use client';

import Link from 'next/link';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useSidebarCollapsed } from '@/lib/stores/simulator-store';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  current: boolean;
  children: React.ReactNode;
  tooltipLabel?: string;
}

export default function SidebarLink({ href, current, children, tooltipLabel }: SidebarLinkProps) {
  const linkComponent = (
    <Link
      href={href}
      className={cn(
        'group focus-outline my-1 flex items-center text-base/6',
        { 'bg-background ring-primary text-primary ring': current },
        { 'hover:bg-background hover:ring-border hover:ring': !current }
      )}
    >
      {children}
    </Link>
  );

  const isSidebarCollapsed = useSidebarCollapsed();
  if (!(tooltipLabel && isSidebarCollapsed)) return linkComponent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{linkComponent}</TooltipTrigger>
      <TooltipContent side="right">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
}
