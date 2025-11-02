'use client';

import { useSidebarCollapsed } from '@/lib/stores/simulator-store';
import { useThemeSwitcher } from '@/hooks/use-theme-switcher';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function SidebarModeToggle() {
  const isSidebarCollapsed = useSidebarCollapsed();

  const themeSwitcher = useThemeSwitcher({ shortenLabel: true });
  if (!themeSwitcher) return null;

  const { newTheme, label, icon: Icon, setTheme } = themeSwitcher;

  const toggleComponent = (
    <button
      onClick={() => setTheme(newTheme)}
      className="group focus-outline hover:bg-background hover:ring-border my-1 flex w-full items-center text-base/6 hover:ring"
    >
      <div className="p-2">
        <Icon aria-hidden="true" className="size-6 shrink-0" />
      </div>
      <span className="ml-1 inline group-data-[state=collapsed]/sidebar:hidden">{label}</span>
    </button>
  );

  if (!isSidebarCollapsed) return toggleComponent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleComponent}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
