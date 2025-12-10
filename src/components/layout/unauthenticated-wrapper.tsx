'use client';

import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import PageLoading from '@/components/ui/page-loading';

export default function UnauthenticatedWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthRedirect();
  if (!isAuthenticated && !isLoading) return <PageLoading message="Redirecting to sign-in" />;
  return <>{children}</>;
}
