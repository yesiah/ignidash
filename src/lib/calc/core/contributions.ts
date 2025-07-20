import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

// Helper function to calculate yearly contribution (income - expenses) for a given year
export const calculateYearlyContribution = (inputs: QuickPlanInputs, year: number, calculateInNominalTerms: boolean): number | null => {
  const { annualIncome, annualExpenses } = inputs.basics;
  if (annualIncome === null || annualExpenses === null) {
    console.warn('Cannot calculate yearly contribution: annual income and expenses are required');
    return null;
  }

  const { incomeGrowthRate, expenseGrowthRate } = inputs.growthRates;

  let effectiveIncomeGrowth: number;
  let effectiveExpenseGrowth: number;

  if (calculateInNominalTerms) {
    // Use the rates as-is (they're already nominal)
    effectiveIncomeGrowth = incomeGrowthRate / 100;
    effectiveExpenseGrowth = expenseGrowthRate / 100;
  } else {
    // Convert nominal rates to real rates
    // Real growth = (1 + nominal) / (1 + inflation) - 1
    effectiveIncomeGrowth = (1 + incomeGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;
    effectiveExpenseGrowth = (1 + expenseGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;
  }

  // Calculate future values using the appropriate growth rates
  const futureIncome = annualIncome * Math.pow(1 + effectiveIncomeGrowth, year);
  const futureExpenses = annualExpenses * Math.pow(1 + effectiveExpenseGrowth, year);

  return futureIncome - futureExpenses;
};
