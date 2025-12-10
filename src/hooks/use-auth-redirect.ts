import { useEffect, useRef } from 'react';
import { useConvexAuth } from 'convex/react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuthRedirect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const wasAuthenticated = useRef<boolean | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (wasAuthenticated.current === null) {
      wasAuthenticated.current = isAuthenticated;
      return;
    }

    if (wasAuthenticated.current === true && isAuthenticated === false) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isLoading, isAuthenticated, router, pathname]);

  return { isLoading, isAuthenticated };
}
