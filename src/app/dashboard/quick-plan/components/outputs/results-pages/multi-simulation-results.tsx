'use client';

import { useState, useEffect } from 'react';

import {
  useMultiSimulationResult,
  useKeyMetrics,
  useSimulationResult,
  useSimulationSeed,
  useCurrentAge,
} from '@/lib/stores/quick-plan-store';
import SectionContainer from '@/components/ui/section-container';
import type { SimulationResult } from '@/lib/calc/v2/simulation-engine';
import type { MultiSimulationTableRow, YearlyAggregateTableRow } from '@/lib/schemas/multi-simulation-table-schema';
import type { MultiSimulationChartData } from '@/lib/types/chart-data-points';
import type { MultiSimulationAnalysis } from '@/lib/calc/v2/multi-simulation-analyzer';
import { useResultsState } from '@/hooks/use-results-state';
import ProgressBar from '@/components/ui/progress-bar';
import { SimulationCategory } from '@/lib/types/simulation-category';

import SimulationMetrics from '../simulation-metrics';
import MultiSimulationMainResults from './multi-simulation-main-results';

interface MultiSimulationResultsSharedProps {
  tableData: MultiSimulationTableRow[];
  yearlyTableData: YearlyAggregateTableRow[];
  chartData: MultiSimulationChartData;
  setCurrentCategory: (category: SimulationCategory) => void;
  currentCategory: SimulationCategory;
  setSelectedSeed: (seed: number | null) => void;
  setCurrentPercentile: (percentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90' | null) => void;
  onAgeSelect: (age: number) => void;
  selectedAge: number;
}

interface MultiSimulationResultsForSelectedSeedProps extends MultiSimulationResultsSharedProps {
  selectedSeed: number;
  simulationMode: 'monteCarloStochasticReturns' | 'monteCarloHistoricalReturns';
}

function MultiSimulationResultsForSelectedSeed({
  selectedSeed,
  simulationMode,
  ...sharedProps
}: MultiSimulationResultsForSelectedSeedProps) {
  let simulationModeForSelectedSeed: 'stochasticReturns' | 'historicalReturns';
  switch (simulationMode) {
    case 'monteCarloStochasticReturns':
      simulationModeForSelectedSeed = 'stochasticReturns';
      break;
    case 'monteCarloHistoricalReturns':
      simulationModeForSelectedSeed = 'historicalReturns';
      break;
  }

  const simulation: SimulationResult = useSimulationResult(simulationModeForSelectedSeed, selectedSeed)!;
  const keyMetrics = useKeyMetrics(simulation)!;

  return (
    <>
      <SectionContainer showBottomBorder className="mb-0">
        <SimulationMetrics keyMetrics={keyMetrics} />
      </SectionContainer>
      <MultiSimulationMainResults
        simulationAndKeyMetrics={{ simulation, keyMetrics }}
        currentPercentile={null}
        selectedSeed={selectedSeed}
        {...sharedProps}
      />
    </>
  );
}

interface MultiSimulationResultsForPercentileProps extends MultiSimulationResultsSharedProps {
  currentPercentile: 'P10' | 'P25' | 'P50' | 'P75' | 'P90';
  analysis: MultiSimulationAnalysis;
}

function MultiSimulationResultsForPercentile({ currentPercentile, analysis, ...sharedProps }: MultiSimulationResultsForPercentileProps) {
  let simulation: SimulationResult;
  switch (currentPercentile) {
    case 'P10':
      ({ result: simulation } = analysis.results.p10);
      break;
    case 'P25':
      ({ result: simulation } = analysis.results.p25);
      break;
    case 'P50':
      ({ result: simulation } = analysis.results.p50);
      break;
    case 'P75':
      ({ result: simulation } = analysis.results.p75);
      break;
    case 'P90':
      ({ result: simulation } = analysis.results.p90);
      break;
  }

  const baseMetrics = useKeyMetrics(simulation)!;
  const keyMetrics = baseMetrics && { ...baseMetrics, success: analysis?.success ?? 0 };

  return (
    <>
      <SectionContainer showBottomBorder className="mb-0">
        <SimulationMetrics keyMetrics={keyMetrics} />
      </SectionContainer>
      <MultiSimulationMainResults
        simulationAndKeyMetrics={{ simulation, keyMetrics }}
        currentPercentile={currentPercentile}
        selectedSeed={null}
        {...sharedProps}
      />
    </>
  );
}

interface MultiSimulationResultsProps {
  simulationMode: 'monteCarloStochasticReturns' | 'monteCarloHistoricalReturns';
}

export default function MultiSimulationResults({ simulationMode }: MultiSimulationResultsProps) {
  const startAge = useCurrentAge()!;
  const { selectedAge, onAgeSelect, currentCategory, setCurrentCategory } = useResultsState(startAge);

  const { analysis, tableData, yearlyTableData, chartData, isLoadingOrValidating, completedSimulations } = useMultiSimulationResult(
    simulationMode,
    currentCategory
  );

  const [currentPercentile, setCurrentPercentile] = useState<'P10' | 'P25' | 'P50' | 'P75' | 'P90' | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);

  const seed = useSimulationSeed();
  useEffect(() => setSelectedSeed(null), [seed, simulationMode]);

  if (!analysis || !tableData || !yearlyTableData || !chartData || isLoadingOrValidating) {
    const roundedSimulations = Math.floor(completedSimulations / 10) * 10;
    const progressPercent = (roundedSimulations / 500) * 100;

    return (
      <div className="flex h-[calc(100vh-7.375rem)] flex-col items-center justify-center gap-8 lg:h-[calc(100vh-4.3125rem)]">
        <p className="text-muted-foreground">
          Completed <strong>{roundedSimulations}</strong> / <strong>500</strong> simulations...
        </p>
        <ProgressBar progressPercent={progressPercent} />
      </div>
    );
  }

  const sharedProps: MultiSimulationResultsSharedProps = {
    tableData,
    yearlyTableData,
    chartData,
    setCurrentCategory,
    currentCategory,
    setSelectedSeed,
    setCurrentPercentile,
    onAgeSelect,
    selectedAge,
  };

  if (selectedSeed !== null) {
    return <MultiSimulationResultsForSelectedSeed selectedSeed={selectedSeed} simulationMode={simulationMode} {...sharedProps} />;
  } else if (currentPercentile !== null) {
    return <MultiSimulationResultsForPercentile currentPercentile={currentPercentile} analysis={analysis} {...sharedProps} />;
  } else {
    return <MultiSimulationMainResults simulationAndKeyMetrics={null} currentPercentile={null} selectedSeed={null} {...sharedProps} />;
  }
}
