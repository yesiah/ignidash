'use client';

import Card from '@/components/ui/card';

import SingleSimulationPortfolioPieChart from '../../charts/single-simulation/single-simulation-portfolio-pie-chart';
import type { SingleSimulationPortfolioAssetTypeAreaChartDataPoint } from '../../charts/single-simulation/single-simulation-portfolio-asset-type-area-chart';

interface SingleSimulationPortfolioAssetTypePieChartCardProps {
  rawChartData: SingleSimulationPortfolioAssetTypeAreaChartDataPoint[];
  selectedAge: number;
}

export default function SingleSimulationPortfolioAssetTypePieChartCard({
  rawChartData,
  selectedAge,
}: SingleSimulationPortfolioAssetTypePieChartCardProps) {
  return (
    <Card className="my-0">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-foreground flex items-center text-lg font-semibold">
          <span className="mr-2">By Asset Class</span>
          <span className="text-muted-foreground">Age {selectedAge}</span>
        </h4>
      </div>
      <SingleSimulationPortfolioPieChart rawChartData={rawChartData} selectedAge={selectedAge} />
    </Card>
  );
}
