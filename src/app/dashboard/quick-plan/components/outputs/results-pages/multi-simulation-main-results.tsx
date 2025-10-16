'use client';

import type { KeyMetrics } from '@/lib/types/key-metrics';
import SectionContainer from '@/components/ui/section-container';
import type { MultiSimulationTableRow, YearlyAggregateTableRow } from '@/lib/schemas/multi-simulation-table-schema';
import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';
import { SimulationCategory } from '@/lib/types/simulation-category';
import { MultiSimulationChartData } from '@/lib/types/chart-data-points';

import SimulationCategorySelector from '../simulation-category-selector';
import SingleSimulationChartsSection from '../sections/single-simulation-charts-section';
import MultiSimulationChartsSection from '../sections/multi-simulation-charts-section';
import MultiSimulationDataTableSection from '../sections/multi-simulation-data-table-section';

interface MultiSimulationMainResultsProps {
  simulationAndKeyMetrics: { simulation: SimulationResult; keyMetrics: KeyMetrics } | null;
  tableData: MultiSimulationTableRow[];
  yearlyTableData: YearlyAggregateTableRow[];
  chartData: MultiSimulationChartData;
  setCurrentCategory: (category: SimulationCategory) => void;
  currentCategory: SimulationCategory;
  setCurrentPercentile: (percentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90' | null) => void;
  currentPercentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90' | null;
  setSelectedSeed: (seed: number | null) => void;
  selectedSeed: number | null;
  onAgeSelect: (age: number) => void;
  selectedAge: number;
}

export default function MultiSimulationMainResults({
  simulationAndKeyMetrics,
  tableData,
  yearlyTableData,
  chartData,
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
      {simulationAndKeyMetrics !== null ? (
        <SingleSimulationChartsSection
          {...simulationAndKeyMetrics}
          onAgeSelect={onAgeSelect}
          selectedAge={selectedAge}
          currentCategory={currentCategory}
          setSelectedSeed={setSelectedSeed}
          selectedSeed={selectedSeed}
        />
      ) : (
        <MultiSimulationChartsSection
          chartData={chartData}
          onAgeSelect={onAgeSelect}
          selectedAge={selectedAge}
          currentCategory={currentCategory}
        />
      )}
      <MultiSimulationDataTableSection
        simulation={simulationAndKeyMetrics?.simulation}
        tableData={tableData}
        yearlyTableData={yearlyTableData}
        currentCategory={currentCategory}
        setSelectedSeed={setSelectedSeed}
        selectedSeed={selectedSeed}
      />
    </>
  );
}
