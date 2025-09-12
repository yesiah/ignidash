'use client';

import Card from '@/components/ui/card';
import type { SingleSimulationReturnsChartDataPoint } from '@/lib/types/chart-data-points';

import SingleSimulationReturnsBarChart from '../../charts/single-simulation/single-simulation-returns-bar-chart';

interface SingleSimulationReturnsBarChartCardProps {
  selectedAge: number;
  rawChartData: SingleSimulationReturnsChartDataPoint[];
  dataView: 'rates' | 'annualAmounts' | 'totalAmounts';
}

export default function SingleSimulationReturnsBarChartCard({
  selectedAge,
  rawChartData,
  dataView,
}: SingleSimulationReturnsBarChartCardProps) {
  let title;
  switch (dataView) {
    case 'rates':
      title = 'Rates';
      break;
    case 'annualAmounts':
      title = 'Annual Amounts';
      break;
    case 'totalAmounts':
      title = 'Total Amounts';
      break;
  }

  return (
    <Card className="my-0">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-foreground flex items-center text-lg font-semibold whitespace-nowrap">
          <span className="mr-2">{title}</span>
          <span className="text-muted-foreground hidden sm:inline">Age {selectedAge}</span>
        </h4>
      </div>
      <SingleSimulationReturnsBarChart age={selectedAge} rawChartData={rawChartData} dataView={dataView} />
    </Card>
  );
}
