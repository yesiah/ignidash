import { ChartPieIcon, ChartBarIcon, BanknotesIcon, DocumentTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import DisclosureSection from '@/components/ui/disclosure-section';

import BasicsSection from './sections/basics/section';
import GoalSection from './sections/retirement-goal/section';
import FineTuneSection from './sections/fine-tune/section';
// import FIREPathsSection from './sections/fire-paths/section';

export default function NumbersColumnSections() {
  return (
    <>
      <div className="divide-border divide-y">
        <DisclosureSection title="Basic Info" icon={UserCircleIcon}>
          <p>Hello</p>
        </DisclosureSection>
        <DisclosureSection title="Cash Flow" icon={BanknotesIcon}>
          <p>Hello</p>
        </DisclosureSection>
        <DisclosureSection title="Investments" icon={ChartPieIcon}>
          <p>Hello</p>
        </DisclosureSection>
        <DisclosureSection title="Retirement Strategy" icon={DocumentTextIcon}>
          <p>Hello</p>
        </DisclosureSection>
        <DisclosureSection title="Simulation Settings" icon={ChartBarIcon}>
          <p>Hello</p>
        </DisclosureSection>
      </div>
      <div className="h-lvh"></div>
      <BasicsSection />
      <GoalSection />
      <FineTuneSection />
      {/* <FIREPathsSection /> */}
    </>
  );
}
