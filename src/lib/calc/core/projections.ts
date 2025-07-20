import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { calculateWeightedPortfolioReturnNominal, calculateWeightedPortfolioReturnReal } from './returns';
import { calculateYearlyContribution } from './contributions';

// Calculation function to determine required portfolio for retirement
export const calculateRequiredPortfolio = (retirementExpenses: number | null, safeWithdrawalRate: number): number | null => {
  if (retirementExpenses === null) {
    console.warn('Cannot calculate required portfolio: retirement expenses is required');
    return null;
  }

  return retirementExpenses / (safeWithdrawalRate / 100);
};

// Calculate future portfolio value with annual contributions
export const calculateFuturePortfolioValue = (inputs: QuickPlanInputs, years: number, calculateInNominalTerms: boolean): number | null => {
  const { investedAssets } = inputs.basics;
  if (investedAssets === null) {
    console.warn('Cannot calculate future portfolio value: invested assets is required');
    return null;
  }

  // Get return rate as decimal
  const rateOfReturn =
    (calculateInNominalTerms
      ? calculateWeightedPortfolioReturnNominal(inputs.allocation, inputs.marketAssumptions)
      : calculateWeightedPortfolioReturnReal(inputs.allocation, inputs.marketAssumptions)) / 100;

  // Current assets grow for the full period
  const futureValueOfAssets = investedAssets * Math.pow(1 + rateOfReturn, years);

  // Calculate future value of all contributions
  let futureValueOfContributions = 0;

  for (let year = 0; year < years; year++) {
    const contribution = calculateYearlyContribution(inputs, year, calculateInNominalTerms);

    // Handle error case from calculateYearlyContribution
    if (contribution === null) {
      console.warn(`Failed to calculate contribution for year ${year}`);
      return null;
    }

    // Contribution made at end of year, so it grows for (years - year - 1) periods
    // For year 0: grows for (years - 1) periods
    // For year (years - 1): grows for 0 periods (no growth)
    const growthPeriods = years - year - 1;

    // Calculate future value of this year's contribution
    // When growthPeriods = 0, Math.pow returns 1, so contribution is added as-is
    futureValueOfContributions += contribution * Math.pow(1 + rateOfReturn, growthPeriods);
  }

  return futureValueOfAssets + futureValueOfContributions;
};
