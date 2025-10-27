import { useSearchParams } from 'next/navigation';

import { getSafeRedirect } from '@/lib/utils/navigation-utils';

export const useRedirectUrl = () => {
  const searchParams = useSearchParams();

  const unsafeRedirect = searchParams.get('redirect');
  const safeRedirect = getSafeRedirect(unsafeRedirect);

  const buildRedirectUrl = (path: string): string => {
    if (!unsafeRedirect) return path;
    return `${path}?redirect=${encodeURIComponent(safeRedirect)}`;
  };

  return { buildRedirectUrl, unsafeRedirect, safeRedirect };
};
