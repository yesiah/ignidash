'use client';

import { useState } from 'react';

import SectionSelector from './section-selector';
import ResultsSections from './outputs/results-sections';
import NumbersColumnSections from './inputs/numbers-column-sections';

type ActiveSection = 'results' | 'your-numbers';

export default function MobileMainArea() {
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
    <div className="mt-[7.375rem] flex h-[calc(100%-7.375rem)] flex-col lg:mt-[4.3125rem] lg:h-[calc(100%-4.3125rem)] xl:hidden">
      <SectionSelector activeSection={activeSection} setActiveSection={setActiveSection} />
      {activeSectionComponent}
    </div>
  );
}
