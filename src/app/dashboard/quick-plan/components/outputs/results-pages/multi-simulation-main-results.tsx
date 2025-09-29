'use client';

import type { KeyMetrics } from '@/lib/types/key-metrics';
import SectionContainer from '@/components/ui/section-container';
import type { MultiSimulationTableRow, YearlyAggregateTableRow } from '@/lib/schemas/multi-simulation-table-schema';
import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';
import { SimulationCategory } from '@/lib/types/simulation-category';

import SimulationCategorySelector from '../simulation-category-selector';
import SingleSimulationChartsSection from '../sections/single-simulation-charts-section';
import MultiSimulationDataTableSection from '../sections/multi-simulation-data-table-section';

interface MultiSimulationMainResultsProps {
  simulation: SimulationResult;
  keyMetrics: KeyMetrics;
  tableData: MultiSimulationTableRow[];
  yearlyTableData: YearlyAggregateTableRow[];
  setCurrentCategory: (category: SimulationCategory) => void;
  currentCategory: SimulationCategory;
  setCurrentPercentile: (percentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90') => void;
  currentPercentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90';
  setSelectedSeed: (seed: number | null) => void;
  selectedSeed: number | null;
  onAgeSelect: (age: number) => void;
  selectedAge: number;
}

export default function MultiSimulationMainResults({
  simulation,
  keyMetrics,
  tableData,
  yearlyTableData,
  setCurrentCategory,
  currentCategory,
  setCurrentPercentile,
  currentPercentile,
  setSelectedSeed,
  selectedSeed,
  onAgeSelect,
  selectedAge,
}: MultiSimulationMainResultsProps) {
  return (
    <>
      <SectionContainer
        showBottomBorder
        className="from-emphasized-background to-background bg-gradient-to-l py-0 xl:sticky xl:top-[4.3125rem] xl:z-10"
      >
        <SimulationCategorySelector
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          currentPercentile={currentPercentile}
          setCurrentPercentile={setCurrentPercentile}
          selectedSeed={selectedSeed}
        />
      </SectionContainer>
      <SingleSimulationChartsSection
        simulation={simulation}
        keyMetrics={keyMetrics}
        onAgeSelect={onAgeSelect}
        selectedAge={selectedAge}
        currentCategory={currentCategory}
        currentPercentile={currentPercentile}
        setSelectedSeed={setSelectedSeed}
        selectedSeed={selectedSeed}
      />
      <MultiSimulationDataTableSection
        simulation={simulation}
        tableData={tableData}
        yearlyTableData={yearlyTableData}
        currentCategory={currentCategory}
        setSelectedSeed={setSelectedSeed}
        selectedSeed={selectedSeed}
      />
    </>
  );
}
