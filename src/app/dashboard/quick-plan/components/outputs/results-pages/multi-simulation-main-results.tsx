'use client';

import { useState } from 'react';

import type { MultiSimulationAnalysis } from '@/lib/calc/v2/multi-simulation-analyzer';
import type { KeyMetrics } from '@/lib/types/key-metrics';
import SectionContainer from '@/components/ui/section-container';
import { useResultsState } from '@/hooks/use-results-state';
import type { MultiSimulationTableRow, YearlyAggregateTableRow } from '@/lib/schemas/multi-simulation-table-schema';
import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';

import SimulationCategorySelector from '../simulation-category-selector';
import SingleSimulationChartsSection from '../sections/single-simulation-charts-section';
import MultiSimulationDataTableSection from '../sections/multi-simulation-data-table-section';

interface MultiSimulationMainResultsProps {
  analysis: MultiSimulationAnalysis;
  keyMetrics: KeyMetrics;
  tableData: MultiSimulationTableRow[];
  yearlyTableData: YearlyAggregateTableRow[];
  simulationMode: 'monteCarloStochasticReturns' | 'monteCarloHistoricalReturns';
}

export default function MultiSimulationMainResults({
  analysis,
  keyMetrics,
  tableData,
  yearlyTableData,
  simulationMode,
}: MultiSimulationMainResultsProps) {
  const [currentPercentile, setCurrentPercentile] = useState<'P10' | 'P25' | 'P50' | 'P75' | 'P90'>('P50');

  let simulation: SimulationResult;
  switch (currentPercentile) {
    case 'P10':
      simulation = analysis.results.p10;
      break;
    case 'P25':
      simulation = analysis.results.p25;
      break;
    case 'P50':
      simulation = analysis.results.p50;
      break;
    case 'P75':
      simulation = analysis.results.p75;
      break;
    case 'P90':
      simulation = analysis.results.p90;
      break;
  }

  const startAge = simulation.context.startAge;
  const { selectedAge, onAgeSelect, currentCategory, setCurrentCategory } = useResultsState(startAge);

  return (
    <>
      <SectionContainer showBottomBorder>
        <SimulationCategorySelector
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          currentPercentile={currentPercentile}
          setCurrentPercentile={setCurrentPercentile}
        />
      </SectionContainer>
      <SingleSimulationChartsSection
        simulation={simulation}
        keyMetrics={keyMetrics}
        onAgeSelect={onAgeSelect}
        selectedAge={selectedAge}
        currentCategory={currentCategory}
      />
      <MultiSimulationDataTableSection
        analysis={analysis}
        tableData={tableData}
        yearlyTableData={yearlyTableData}
        currentCategory={currentCategory}
        simulationMode={simulationMode}
      />
    </>
  );
}
