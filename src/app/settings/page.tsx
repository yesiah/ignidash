import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

import SettingsForms from './components/settings-forms';

export default async function SettingsPage() {
  const preloadedUser = await preloadQuery(api.auth.getCurrentUserSafe);

  return <SettingsForms preloadedUser={preloadedUser} />;
}
