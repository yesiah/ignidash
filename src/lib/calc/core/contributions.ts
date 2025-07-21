import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

// Helper function to calculate yearly contribution (income - expenses) for a given year
export const calculateYearlyContribution = (inputs: QuickPlanInputs, year: number): number | null => {
  const { annualIncome, annualExpenses } = inputs.basics;
  if (annualIncome === null || annualExpenses === null) {
    console.warn('Cannot calculate yearly contribution: annual income and expenses are required');
    return null;
  }

  const { incomeGrowthRate, expenseGrowthRate } = inputs.growthRates;

  // Convert nominal rates to real rates
  // Real growth = (1 + nominal) / (1 + inflation) - 1
  const realIncomeGrowth = (1 + incomeGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;
  const realExpenseGrowth = (1 + expenseGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;

  // Calculate future values using the appropriate growth rates
  const futureIncome = annualIncome * Math.pow(1 + realIncomeGrowth, year);
  const futureExpenses = annualExpenses * Math.pow(1 + realExpenseGrowth, year);

  return futureIncome - futureExpenses;
};
