import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { calculateWeightedPortfolioReturnReal } from './returns';
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
export const calculateFuturePortfolioValue = (inputs: QuickPlanInputs, years: number): number | null => {
  const { investedAssets } = inputs.basics;
  if (investedAssets === null) {
    console.warn('Cannot calculate future portfolio value: invested assets is required');
    return null;
  }

  // Get return rate as decimal
  const rateOfReturn = calculateWeightedPortfolioReturnReal(inputs.allocation, inputs.marketAssumptions) / 100;

  // Current assets grow for the full period
  const futureValueOfAssets = investedAssets * Math.pow(1 + rateOfReturn, years);

  // Calculate future value of all contributions
  let futureValueOfContributions = 0;

  // Handle full years
  const fullYears = Math.floor(years);
  for (let year = 0; year < fullYears; year++) {
    const contribution = calculateYearlyContribution(inputs, year);

    // Handle error case from calculateYearlyContribution
    if (contribution === null) {
      console.warn(`Failed to calculate contribution for year ${year}`);
      return null;
    }

    // Contribution made at end of year, so it grows for (years - year - 1) periods
    const growthPeriods = years - year - 1;
    futureValueOfContributions += contribution * Math.pow(1 + rateOfReturn, growthPeriods);
  }

  // Handle partial year if present
  const partialYear = years - fullYears;
  if (partialYear > 0) {
    const partialYearContribution = calculateYearlyContribution(inputs, fullYears);

    // Handle error case from calculateYearlyContribution
    if (partialYearContribution === null) {
      console.warn(`Failed to calculate contribution for partial year ${fullYears}`);
      return null;
    }

    // For partial year, contribution is prorated and made at the end of the partial period
    // So it has no growth period (added at the very end)
    const proratedContribution = partialYearContribution * partialYear;
    futureValueOfContributions += proratedContribution;
  }

  return futureValueOfAssets + futureValueOfContributions;
};
