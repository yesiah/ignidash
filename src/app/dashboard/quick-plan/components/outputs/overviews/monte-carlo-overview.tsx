'use client';

import {
  useMonteCarloSimulation,
  useMonteCarloAnalysis,
  useMonteCarloPortfolioAreaChartData,
  useMonteCarloPortfolioPercentilesChartData,
  useMonteCarloPortfolioDistributionChartData,
  useMonteCarloCashFlowChartData,
  useMonteCarloPhasePercentAreaChartData,
  useMonteCarloReturnsChartData,
  useMonteCarloWithdrawalsChartData,
} from '@/lib/stores/quick-plan-store';
import SectionHeader from '@/components/ui/section-header';
import SectionContainer from '@/components/ui/section-container';

import ResultsMetrics from '../stochastic-metrics';
import StochasticDataTableSection from '../sections/stochastic-data-table-section';
import StochasticChartsSection from '../sections/stochastic-charts-section';

export default function MonteCarloOverview() {
  const simulation = useMonteCarloSimulation();
  const analysis = useMonteCarloAnalysis(simulation);

  const portfolioAreaChartData = useMonteCarloPortfolioAreaChartData(simulation);
  const portfolioPercentilesChartData = useMonteCarloPortfolioPercentilesChartData(simulation);
  const portfolioDistributionChartData = useMonteCarloPortfolioDistributionChartData(simulation);
  const cashFlowChartData = useMonteCarloCashFlowChartData(simulation);
  const phasePercentChartData = useMonteCarloPhasePercentAreaChartData(simulation);
  const returnsChartData = useMonteCarloReturnsChartData(simulation);
  const withdrawalsChartData = useMonteCarloWithdrawalsChartData(simulation);

  return (
    <>
      <SectionContainer showBottomBorder>
        <SectionHeader title="Key Metrics" desc="A snapshot of your simulation's most important results." />
        <ResultsMetrics analysis={analysis} />
      </SectionContainer>
      <StochasticChartsSection
        analysis={analysis}
        portfolioAreaChartData={portfolioAreaChartData}
        portfolioPercentilesChartData={portfolioPercentilesChartData}
        portfolioDistributionChartData={portfolioDistributionChartData}
        cashFlowChartData={cashFlowChartData}
        phasePercentChartData={phasePercentChartData}
        returnsChartData={returnsChartData}
        withdrawalsChartData={withdrawalsChartData}
      />
      <SectionContainer showBottomBorder>
        <SectionHeader title="Quick Stats" desc="A brief overview of your simulation's statistics." />
        <div className="text-muted-foreground ml-2 py-10 text-center font-semibold italic">
          <p>Coming soon...</p>
        </div>
      </SectionContainer>
      <StochasticDataTableSection simulation={simulation} simulationType="monteCarlo" />
    </>
  );
}
