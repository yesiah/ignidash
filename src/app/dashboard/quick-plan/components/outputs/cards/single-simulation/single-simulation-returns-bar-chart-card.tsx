'use client';

import Card from '@/components/ui/card';
import type { SingleSimulationReturnsChartDataPoint } from '@/lib/types/chart-data-points';
import { Subheading } from '@/components/catalyst/heading';

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
      title = 'Real Rates';
      break;
    case 'annualAmounts':
      title = 'Annual Returns';
      break;
    case 'totalAmounts':
      title = 'Total Returns';
      break;
  }

  return (
    <Card className="my-0">
      <div className="mb-4 flex items-center justify-between">
        <Subheading level={4}>
          <span className="mr-2">{title}</span>
          <span className="text-muted-foreground hidden sm:inline">Age {selectedAge}</span>
        </Subheading>
      </div>
      <SingleSimulationReturnsBarChart age={selectedAge} rawChartData={rawChartData} dataView={dataView} />
    </Card>
  );
}
