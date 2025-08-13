'use client';

import { useState } from 'react';
import { ReceiptPercentIcon, ChartBarSquareIcon } from '@heroicons/react/20/solid';

import {
  useMonteCarloPortfolioHistogramData,
  useMonteCarloPortfolioDistributionHistogramData,
  useHistoricalBacktestPortfolioHistogramData,
  useHistoricalBacktestPortfolioDistributionHistogramData,
} from '@/lib/stores/quick-plan-store';
import Card from '@/components/ui/card';
import ButtonGroup from '@/components/ui/button-group';
import type { MultiSimulationResult } from '@/lib/calc/simulation-engine';

import StochasticPortfolioBarChart from '../charts/stochastic-portfolio-bar-chart';

interface MonteCarloPortfolioBarChartProps {
  viewMode: 'percentiles' | 'counts';
  simulation: MultiSimulationResult;
  selectedAge: number;
}

function MonteCarloPortfolioBarChart({ viewMode, simulation, selectedAge }: MonteCarloPortfolioBarChartProps) {
  const percentilesData = useMonteCarloPortfolioHistogramData(simulation);
  const distributionData = useMonteCarloPortfolioDistributionHistogramData(simulation);

  let rawChartData;
  switch (viewMode) {
    case 'percentiles':
      rawChartData = percentilesData;
      break;
    case 'counts':
      rawChartData = distributionData;
      break;
  }

  return <StochasticPortfolioBarChart age={selectedAge} mode={viewMode} rawChartData={rawChartData} />;
}

interface HistoricalBacktestPortfolioBarChartProps {
  viewMode: 'percentiles' | 'counts';
  simulation: MultiSimulationResult;
  selectedAge: number;
}

function HistoricalBacktestPortfolioBarChart({ viewMode, simulation, selectedAge }: HistoricalBacktestPortfolioBarChartProps) {
  const percentilesData = useHistoricalBacktestPortfolioHistogramData(simulation);
  const distributionData = useHistoricalBacktestPortfolioDistributionHistogramData(simulation);

  let rawChartData;
  switch (viewMode) {
    case 'percentiles':
      rawChartData = percentilesData;
      break;
    case 'counts':
      rawChartData = distributionData;
      break;
  }

  return <StochasticPortfolioBarChart age={selectedAge} mode={viewMode} rawChartData={rawChartData} />;
}

interface StochasticPortfolioBarChartCardProps {
  simulation: MultiSimulationResult;
  simulationType: 'monteCarlo' | 'historicalBacktest';
  setSelectedAge: (age: number) => void;
  selectedAge: number;
}

export default function StochasticPortfolioBarChartCard({ simulation, simulationType, selectedAge }: StochasticPortfolioBarChartCardProps) {
  const [viewMode, setViewMode] = useState<'percentiles' | 'counts'>('percentiles');

  let barChart = null;
  switch (simulationType) {
    case 'monteCarlo':
      barChart = <MonteCarloPortfolioBarChart viewMode={viewMode} simulation={simulation} selectedAge={selectedAge} />;
      break;
    case 'historicalBacktest':
      barChart = <HistoricalBacktestPortfolioBarChart viewMode={viewMode} simulation={simulation} selectedAge={selectedAge} />;
      break;
  }

  let title = '';
  switch (viewMode) {
    case 'percentiles':
      title = 'Percentiles';
      break;
    case 'counts':
      title = 'Distributions';
      break;
  }

  return (
    <Card className="my-0">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-foreground flex items-center text-lg font-semibold">
          <span className="mr-2">Portfolio {title}</span>
          <span className="text-muted-foreground">Age {selectedAge}</span>
        </h4>
        <ButtonGroup
          firstButtonText="Percentiles"
          firstButtonIcon={<ReceiptPercentIcon />}
          firstButtonOnClick={() => setViewMode('percentiles')}
          lastButtonText="Counts"
          lastButtonIcon={<ChartBarSquareIcon />}
          lastButtonOnClick={() => setViewMode('counts')}
          defaultActiveButton="first"
        />
      </div>
      {barChart}
    </Card>
  );
}
