'use client';

import { useSimulationResult, useKeyMetrics } from '@/lib/stores/simulator-store';
import SectionContainer from '@/components/ui/section-container';

import SimulationMetrics from '../simulation-metrics';
import SingleSimulationMainResults from './single-simulation-main-results';

interface SingleSimulationResultsProps {
  simulationMode: 'fixedReturns' | 'stochasticReturns' | 'historicalReturns';
}

export default function SingleSimulationResults({ simulationMode }: SingleSimulationResultsProps) {
  const simulationResult = useSimulationResult(simulationMode);
  const keyMetrics = useKeyMetrics(simulationResult);

  if (!simulationResult || !keyMetrics) {
    return (
      <div className="text-muted-foreground text-center">
        <p>Results content will be displayed here...</p>
      </div>
    );
  }

  return (
    <>
      <SectionContainer showBottomBorder className="mb-0">
        <SimulationMetrics keyMetrics={keyMetrics} />
      </SectionContainer>
      <SingleSimulationMainResults simulation={simulationResult} keyMetrics={keyMetrics} />
    </>
  );
}
