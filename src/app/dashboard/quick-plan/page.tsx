'use client';

import { useState } from 'react';

import MainArea from '@/components/layout/main-area';
import SecondaryColumn from '@/components/layout/secondary-column';

import SectionSelector from './components/section-selector';
import ResultsSections from './components/outputs/results-sections';
import ResultsColumnHeader from './components/outputs/results-column-header';
import NumbersColumnSections from './components/inputs/numbers-column-sections';
import NumbersColumnHeader from './components/inputs/numbers-column-header';

type ActiveSection = 'results' | 'your-numbers';

export default function QuickPlanPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('your-numbers');

  let activeSectionComponent;
  switch (activeSection) {
    case 'results':
      activeSectionComponent = <ResultsSections />;
      break;
    case 'your-numbers':
      activeSectionComponent = <NumbersColumnSections />;
      break;
  }

  return (
    <>
      <MainArea>
        <div className="block xl:hidden">
          <SectionSelector activeSection={activeSection} setActiveSection={setActiveSection} />
          {activeSectionComponent}
        </div>
        <div className="hidden xl:block">
          <ResultsColumnHeader />
          <ResultsSections />
        </div>
      </MainArea>
      <SecondaryColumn>
        <NumbersColumnHeader />
        <NumbersColumnSections />
      </SecondaryColumn>
    </>
  );
}
