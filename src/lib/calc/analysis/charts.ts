import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { calculateFuturePortfolioValue } from '../core/projections';

export interface ChartDataPoint {
  age: number;
  portfolioValue: number;
}

export const getFIREChartData = (inputs: QuickPlanInputs): ChartDataPoint[] => {
  const startAge = inputs.basics.currentAge;
  const endAge = inputs.retirementFunding.lifeExpectancy;
  if (startAge === null) return [];

  const data: ChartDataPoint[] = [];
  for (let age = startAge; age <= endAge; age++) {
    const portfolioValue = calculateFuturePortfolioValue(
      inputs,
      age - startAge,
      false // Use real terms
    );

    if (portfolioValue !== null) {
      data.push({ age, portfolioValue });
    }
  }

  return data;
};
