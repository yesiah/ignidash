'use client';

import SettingsNavbar from './components/settings-navbar';
import SettingsForms from './components/settings-forms';

export default function SettingsPage() {
  return (
    <>
      <SettingsNavbar />
      <SettingsForms fetchedName="" fetchedEmail="" />
    </>
  );
}
