import MainArea from '@/components/layout/main-area';
import SecondaryColumn from '@/components/layout/secondary-column';

import NumbersColumnSections from './components/inputs/numbers-column-sections';
import NumbersColumnHeader from './components/inputs/numbers-column-header';
import DesktopMainArea from './components/desktop-main-area';
import MobileMainArea from './components/mobile-main-area';

export default function QuickPlanPage() {
  return (
    <>
      <MainArea>
        <MobileMainArea />
        <DesktopMainArea />
      </MainArea>
      <SecondaryColumn>
        <NumbersColumnHeader />
        <div className="flex h-[calc(100%-4.3125rem)] flex-col pt-[4.3125rem]">
          <NumbersColumnSections />
        </div>
      </SecondaryColumn>
    </>
  );
}
