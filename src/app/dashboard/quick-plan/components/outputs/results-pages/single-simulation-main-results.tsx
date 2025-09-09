'use client';

import { useState } from 'react';

import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';
import type { FixedReturnsKeyMetricsV2 } from '@/lib/stores/quick-plan-store';

import SingleSimulationCategorySelector, { SingleSimulationCategory } from '../single-simulation-category-selector';
import SingleSimulationChartsSection from '../sections/single-simulation-charts-section';

interface SingleSimulationMainResultsProps {
  simulation: SimulationResult;
  keyMetrics: FixedReturnsKeyMetricsV2;
}

export default function SingleSimulationMainResults({ simulation, keyMetrics }: SingleSimulationMainResultsProps) {
  const startAge = simulation.context.startAge;

  const [selectedAge, setSelectedAge] = useState<number>(startAge + 1);
  const [currentCategory, setCurrentCategory] = useState<SingleSimulationCategory>(SingleSimulationCategory.Portfolio);

  return (
    <>
      <div>
        <SingleSimulationCategorySelector currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
      </div>
      <SingleSimulationChartsSection
        simulation={simulation}
        keyMetrics={keyMetrics}
        setSelectedAge={setSelectedAge}
        selectedAge={selectedAge}
        currentCategory={currentCategory}
      />
    </>
  );
}
