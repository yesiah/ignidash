import Card from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import { FixedReturnsAnalysis } from '@/lib/stores/quick-plan-store';

interface ResultsMetricsProps {
  fireAnalysis: FixedReturnsAnalysis;
}

export default function ResultsMetrics({ fireAnalysis }: ResultsMetricsProps) {
  const fireAgeCard = (
    <Card className="my-0 text-center sm:text-left">
      <dt className="text-muted-foreground truncate text-sm font-medium">FIRE Age</dt>
      <dd className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
        {fireAnalysis.fireAge !== null ? `${formatNumber(fireAnalysis.fireAge, 0)}` : '∞'}
      </dd>
    </Card>
  );
  const yearsToFireCard = (
    <Card className="my-0 text-center sm:text-left">
      <dt className="text-muted-foreground truncate text-sm font-medium">Years to FIRE</dt>
      <dd className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
        {fireAnalysis.yearsToFIRE !== null ? `${formatNumber(fireAnalysis.yearsToFIRE, 0)}` : '∞'}
      </dd>
    </Card>
  );
  const requiredPortfolioCard = (
    <Card className="my-0 text-center sm:text-left">
      <dt className="text-muted-foreground truncate text-sm font-medium">Required Portfolio</dt>
      <dd className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
        {`$${formatNumber(fireAnalysis.requiredPortfolio, 2)}`}
      </dd>
    </Card>
  );
  const finalPortfolioCard = (
    <Card className="my-0 text-center sm:text-left">
      <dt className="text-muted-foreground truncate text-sm font-medium">Final Portfolio</dt>
      <dd className="text-foreground mt-1 text-3xl font-semibold tracking-tight">{`$${formatNumber(fireAnalysis.finalPortfolio, 2)}`}</dd>
    </Card>
  );

  return (
    <dl className="mt-4 mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-4">
      {fireAgeCard}
      {yearsToFireCard}
      {requiredPortfolioCard}
      {finalPortfolioCard}
    </dl>
  );
}
