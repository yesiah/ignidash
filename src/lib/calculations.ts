import { QuickPlanInputs } from "./schemas/quick-plan-schema";

// Calculation function to determine required portfolio for retirement
export const calculateRequiredPortfolio = (inputs: QuickPlanInputs): number => {
  const { retirementExpenses } = inputs.goals;
  const { safeWithdrawalRate } = inputs.retirementFunding;

  if (retirementExpenses === null) {
    console.warn(
      "Cannot calculate required portfolio: retirement expenses is required"
    );
    return -1;
  }

  if (safeWithdrawalRate === null) {
    console.warn(
      "Cannot calculate required portfolio: safe withdrawal rate is required"
    );
    return -1;
  }

  return retirementExpenses / (safeWithdrawalRate / 100);
};

// Helper function to calculate nominal portfolio return
export const calculatePortfolioReturnNominal = (
  inputs: QuickPlanInputs
): number => {
  const { stockAllocation, bondAllocation, cashAllocation } = inputs.allocation;
  const { stockReturn, bondReturn, cashReturn } = inputs.marketAssumptions;

  // Validate allocations sum to 100%
  const totalAllocation = stockAllocation + bondAllocation + cashAllocation;
  if (Math.abs(totalAllocation - 100) > 0.01) {
    console.warn(`Allocations sum to ${totalAllocation}%, not 100%`);
  }

  // Convert percentages to decimals
  const stockWeight = stockAllocation / 100;
  const bondWeight = bondAllocation / 100;
  const cashWeight = cashAllocation / 100;

  const stockReturnDecimal = stockReturn / 100;
  const bondReturnDecimal = bondReturn / 100;
  const cashReturnDecimal = cashReturn / 100;

  return (
    (stockWeight * stockReturnDecimal +
      bondWeight * bondReturnDecimal +
      cashWeight * cashReturnDecimal) *
    100
  );
};

// Helper function to calculate real portfolio return
export const calculatePortfolioReturnReal = (
  inputs: QuickPlanInputs
): number => {
  const { inflationRate } = inputs.marketAssumptions;

  // Get nominal return using the nominal function
  const nominalReturn = calculatePortfolioReturnNominal(inputs);

  // Calculate real return (adjust for inflation)
  const realReturn = (1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1;

  return realReturn * 100;
};

// Helper function to calculate yearly contribution (income - expenses) for a given year
export const calculateYearlyContribution = (
  inputs: QuickPlanInputs,
  year: number
): number => {
  const { annualIncome, annualExpenses } = inputs.basics;
  const { incomeGrowthRate, expenseGrowthRate } = inputs.growthRates;

  if (annualIncome === null || annualExpenses === null) {
    console.warn(
      "Cannot calculate yearly contribution: annual income and expenses are required"
    );
    return -1;
  }

  // Calculate income and expenses for the given year
  // Year n contribution = (annualIncome × (1 + incomeGrowthRate/100)^n) - (annualExpenses × (1 + expenseGrowthRate/100)^n)
  const futureIncome =
    annualIncome * Math.pow(1 + incomeGrowthRate / 100, year);
  const futureExpenses =
    annualExpenses * Math.pow(1 + expenseGrowthRate / 100, year);

  return futureIncome - futureExpenses;
};

// Calculate future portfolio value with annual contributions
export const calculateFuturePortfolioValue = (
  inputs: QuickPlanInputs,
  years: number
): number => {
  const { investedAssets } = inputs.basics;

  if (investedAssets === null) {
    console.warn(
      "Cannot calculate future portfolio value: invested assets is required"
    );
    return -1;
  }

  // Get real (inflation-adjusted) return rate as decimal
  const realReturn = calculatePortfolioReturnReal(inputs) / 100;

  // Current assets grow for the full period
  const futureValueOfAssets = investedAssets * Math.pow(1 + realReturn, years);

  // Calculate future value of all contributions
  let futureValueOfContributions = 0;

  for (let year = 0; year < years; year++) {
    const contribution = calculateYearlyContribution(inputs, year);

    // Handle error case from calculateYearlyContribution
    if (contribution === -1) {
      console.warn(`Failed to calculate contribution for year ${year}`);
      return -1;
    }

    // Contribution made at end of year, so it grows for (years - year - 1) periods
    // For year 0: grows for (years - 1) periods
    // For year (years - 1): grows for 0 periods (no growth)
    const growthPeriods = years - year - 1;

    // Calculate future value of this year's contribution
    // When growthPeriods = 0, Math.pow returns 1, so contribution is added as-is
    futureValueOfContributions +=
      contribution * Math.pow(1 + realReturn, growthPeriods);
  }

  return futureValueOfAssets + futureValueOfContributions;
};
