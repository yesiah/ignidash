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
