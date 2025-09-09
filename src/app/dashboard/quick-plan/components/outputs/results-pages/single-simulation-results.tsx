'use client';

import { useFixedReturnsSimulationV2, useFixedReturnsKeyMetricsV2 } from '@/lib/stores/quick-plan-store';
import SectionContainer from '@/components/ui/section-container';

import SingleSimulationMetrics from '../single-simulation-metrics';
import SingleSimulationMainResults from './single-simulation-main-results';

export default function SingleSimulationResults() {
  const simulationResult = useFixedReturnsSimulationV2();
  const keyMetrics = useFixedReturnsKeyMetricsV2(simulationResult);

  if (!simulationResult || !keyMetrics) {
    return (
      <div className="text-muted-foreground text-center">
        <p>Results content will be displayed here...</p>
      </div>
    );
  }

  return (
    <>
      <SectionContainer showBottomBorder>
        <SingleSimulationMetrics keyMetrics={keyMetrics} />
      </SectionContainer>
      <SingleSimulationMainResults simulation={simulationResult} keyMetrics={keyMetrics} />
    </>
  );
}
