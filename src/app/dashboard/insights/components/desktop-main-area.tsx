import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';

import { getToken } from '@/lib/auth-server';

import InsightsColumnHeader from './insights-column-header';
import InsightsContent from './insights-content';

export default async function DesktopMainArea() {
  const token = await getToken();
  if (!token) redirect('/signin');

  const preloadedUser = await preloadQuery(api.auth.getCurrentUserSafe, {}, { token });

  return (
    <div className="hidden h-full lg:block">
      <InsightsColumnHeader preloadedUser={preloadedUser} />
      <div className="flex h-[calc(100vh-9.1rem)] flex-col pt-[4.3125rem] lg:h-[calc(100vh-9.3625rem)]">
        <InsightsContent />
      </div>
    </div>
  );
}
