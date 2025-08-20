'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { SunMediumIcon } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';

export default function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return null;
  }

  const icon = SunMediumIcon;
  let label;
  let newTheme;

  if (isDark) {
    label = 'Switch to light mode';
    newTheme = 'light';
  } else {
    label = 'Switch to dark mode';
    newTheme = 'dark';
  }

  return <IconButton icon={icon} label={label} onClick={() => setTheme(newTheme)} surfaceColor="emphasized" />;
}

interface SidebarModeToggleProps {
  children: React.ReactNode;
}

export function SidebarModeToggle({ children }: SidebarModeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return null;
  }

  let newTheme;
  if (isDark) {
    newTheme = 'light';
  } else {
    newTheme = 'dark';
  }

  return (
    <button
      onClick={() => setTheme(newTheme)}
      className="group focus-outline hover:bg-background hover:ring-border my-1 flex w-full items-center rounded-md text-sm/6 hover:ring"
    >
      {children}
    </button>
  );
}
