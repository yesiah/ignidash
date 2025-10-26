import Card from '@/components/ui/card';
import SectionContainer from '@/components/ui/section-container';

import SettingsNavbar from './settings-navbar';

export default function SettingsPage() {
  return (
    <>
      <SettingsNavbar />
      <main className="mx-auto max-w-prose flex-1 overflow-y-auto pt-[4.25rem]">
        <SectionContainer showBottomBorder={false}>
          <Card>This is card text.</Card>
        </SectionContainer>
      </main>
    </>
  );
}
