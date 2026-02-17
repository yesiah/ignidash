import MainArea from '@/components/layout/main-area';
import SecondaryColumn from '@/components/layout/secondary-column';

import DesktopMainArea from './components/desktop-main-area';
import DesktopSecondaryColumnArea from './components/desktop-secondary-column-area';
import MobileMainArea from './components/mobile-main-area';

export default function SimulatorPage() {
  return (
    <>
      <MainArea>
        <MobileMainArea />
        <DesktopMainArea />
      </MainArea>
      <SecondaryColumn>
        <DesktopSecondaryColumnArea />
      </SecondaryColumn>
    </>
  );
}
