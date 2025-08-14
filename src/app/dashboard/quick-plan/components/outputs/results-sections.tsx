'use client';

import { useIsCalculationReady, useMarketAssumptionsData } from '@/lib/stores/quick-plan-store';

import FixedReturnsOverview from './results-pages/fixed-returns-results';
import MonteCarloOverview from './results-pages/monte-carlo-results';
import HistoricalBacktestOverview from './results-pages/historical-backtest-results';

export default function ResultsSections() {
  const isCalculationReady = useIsCalculationReady();
  const marketAssumptions = useMarketAssumptionsData();

  if (!isCalculationReady) {
    return (
      <div className="text-muted-foreground text-center">
        <p>Results content will be displayed here</p>
      </div>
    );
  }

  switch (marketAssumptions.simulationMode) {
    case 'fixedReturns':
      return <FixedReturnsOverview />;
    case 'monteCarlo':
      return <MonteCarloOverview />;
    case 'historicalBacktest':
      return <HistoricalBacktestOverview />;
  }
}
