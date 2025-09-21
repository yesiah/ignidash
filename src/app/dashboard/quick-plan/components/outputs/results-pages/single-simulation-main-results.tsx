'use client';

import { useState, useCallback } from 'react';

import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';
import type { KeyMetrics } from '@/lib/types/key-metrics';
import { SimulationCategory } from '@/lib/types/simulation-category';
import SectionContainer from '@/components/ui/section-container';

import SimulationCategorySelector from '../single-simulation-category-selector';
import SingleSimulationChartsSection from '../sections/single-simulation-charts-section';
import SingleSimulationDataTableSection from '../sections/single-simulation-data-table-section';

interface SingleSimulationMainResultsProps {
  simulation: SimulationResult;
  keyMetrics: KeyMetrics;
}

export default function SingleSimulationMainResults({ simulation, keyMetrics }: SingleSimulationMainResultsProps) {
  const startAge = simulation.context.startAge;

  const [selectedAge, setSelectedAge] = useState<number>(startAge + 1);
  const onAgeSelect = useCallback(
    (age: number) => {
      if (age >= startAge + 1) setSelectedAge(age);
    },
    [startAge]
  );

  const [currentCategory, setCurrentCategory] = useState<SimulationCategory>(SimulationCategory.Portfolio);

  return (
    <>
      <SectionContainer showBottomBorder>
        <SimulationCategorySelector currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
      </SectionContainer>
      <SingleSimulationChartsSection
        simulation={simulation}
        keyMetrics={keyMetrics}
        onAgeSelect={onAgeSelect}
        selectedAge={selectedAge}
        currentCategory={currentCategory}
      />
      <SingleSimulationDataTableSection simulation={simulation} currentCategory={currentCategory} />
    </>
  );
}
