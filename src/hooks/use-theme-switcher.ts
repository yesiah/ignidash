import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunMediumIcon, MoonIcon } from 'lucide-react';

export function useThemeSwitcher({ shortenLabel }: { shortenLabel: boolean } = { shortenLabel: false }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (resolvedTheme === 'dark') {
    return { newTheme: 'light', label: shortenLabel ? 'Light mode' : 'Switch to light mode', icon: SunMediumIcon, setTheme };
  } else {
    return { newTheme: 'dark', label: shortenLabel ? 'Dark mode' : 'Switch to dark mode', icon: MoonIcon, setTheme };
  }
}
