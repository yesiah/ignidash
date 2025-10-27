const ALLOWED_REDIRECTS = ['/', '/dashboard', '/dashboard/quick-plan', '/settings'];

export function getSafeRedirect(redirectParam: string | null): string {
  if (redirectParam && ALLOWED_REDIRECTS.includes(redirectParam)) {
    return redirectParam;
  }

  return '/';
}
