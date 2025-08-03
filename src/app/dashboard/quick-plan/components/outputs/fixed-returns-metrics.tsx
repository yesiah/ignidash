import { formatNumber } from '@/lib/utils';
import { FixedReturnsAnalysis } from '@/lib/stores/quick-plan-store';

import MetricsCard from './metrics-card';

interface ResultsMetricsProps {
  fireAnalysis: FixedReturnsAnalysis;
}

export default function ResultsMetrics({ fireAnalysis }: ResultsMetricsProps) {
  const progressToFIRE = `${formatNumber(fireAnalysis.progressToFIRE * 100, 0)}%`;
  const fireAge = fireAnalysis.fireAge !== null ? `${formatNumber(fireAnalysis.fireAge, 0)}` : '∞';
  const yearsToFIRE = fireAnalysis.yearsToFIRE !== null ? `${formatNumber(fireAnalysis.yearsToFIRE, 0)}` : '∞';
  const requiredPortfolio = `$${formatNumber(fireAnalysis.requiredPortfolio, 2)}`;
  const finalPortfolio = `$${formatNumber(fireAnalysis.finalPortfolio, 2)}`;
  const returnOnInvestment = `${((fireAnalysis.performance ?? 0) * 100).toFixed(1)}%`;

  return (
    <dl className="mt-4 mb-8 grid grid-cols-2 gap-2 2xl:grid-cols-3">
      <MetricsCard name="Progress to FIRE" stat={progressToFIRE} />
      <MetricsCard name="FIRE Age" stat={fireAge} />
      <MetricsCard name="Years to FIRE" stat={yearsToFIRE} />
      <MetricsCard name="Required Portfolio" stat={requiredPortfolio} />
      <MetricsCard name="Final Portfolio" stat={finalPortfolio} />
      <MetricsCard name="Return on Investment" stat={returnOnInvestment} />
    </dl>
  );
}
