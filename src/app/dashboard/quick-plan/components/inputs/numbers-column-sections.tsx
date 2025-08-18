import { ChartPieIcon } from '@heroicons/react/24/outline';

import DisclosureSection from '@/components/ui/disclosure-section';

import BasicsSection from './sections/basics/section';
import GoalSection from './sections/retirement-goal/section';
import FineTuneSection from './sections/fine-tune/section';
// import FIREPathsSection from './sections/fire-paths/section';

export default function NumbersColumnSections() {
  return (
    <>
      <DisclosureSection title="Basic Info" desc={'Basic info about you.'} icon={ChartPieIcon}>
        <p>Hello</p>
      </DisclosureSection>
      <BasicsSection />
      <GoalSection />
      <FineTuneSection />
      {/* <FIREPathsSection /> */}
    </>
  );
}
