import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { Portfolio, PortfolioChange } from './portfolio';

export interface CashFlow {
  readonly id: string;
  readonly name: string;

  shouldApply(year: number, currentAge: number, portfolio: Portfolio, inputs: QuickPlanInputs): boolean;
  calculateChange(
    year: number,
    currentAge: number,
    portfolio: Portfolio,
    inputs: QuickPlanInputs,
    accumulatedChange: PortfolioChange
  ): PortfolioChange;
}

export class SalaryIncome implements CashFlow {
  id = 'salary-income';
  name = 'Salary Income';

  shouldApply(_year: number, _currentAge: number, _portfolio: Portfolio, _inputs: QuickPlanInputs): boolean {
    return true;
  }

  calculateChange(
    year: number,
    _currentAge: number,
    _portfolio: Portfolio,
    inputs: QuickPlanInputs,
    _accumulatedChange: PortfolioChange
  ): PortfolioChange {
    const { annualIncome } = inputs.basics;
    if (!annualIncome) {
      return {
        assetChanges: { cash: 0, stocks: 0, bonds: 0 },
        description: 'No salary income configured',
      };
    }
    // Convert nominal growth to real growth
    const { incomeGrowthRate } = inputs.growthRates;
    const realIncomeGrowth = (1 + incomeGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;

    // Calculate future income
    const futureIncome = annualIncome * Math.pow(1 + realIncomeGrowth, year);

    return {
      assetChanges: { cash: futureIncome, stocks: 0, bonds: 0 },
      description: `Net salary income: ${futureIncome.toLocaleString()}`,
      metadata: {
        baseIncome: annualIncome,
        growthRate: realIncomeGrowth,
      },
    };
  }
}

export class PreRetirementLivingExpenses implements CashFlow {
  id = 'pre-retirement-living-expenses';
  name = 'Pre-Retirement Living Expenses';

  shouldApply(_year: number, _currentAge: number, _portfolio: Portfolio, _inputs: QuickPlanInputs): boolean {
    return true;
  }

  calculateChange(
    year: number,
    _currentAge: number,
    _portfolio: Portfolio,
    inputs: QuickPlanInputs,
    _accumulatedChange: PortfolioChange
  ): PortfolioChange {
    const { annualExpenses } = inputs.basics;
    if (!annualExpenses) {
      return {
        assetChanges: { cash: 0, stocks: 0, bonds: 0 },
        description: 'No pre-retirement living expenses configured',
      };
    }

    // Convert nominal growth to real growth
    const { expenseGrowthRate } = inputs.growthRates;
    const realExpenseGrowth = (1 + expenseGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;

    // Calculate future expenses
    const futureExpenses = annualExpenses * Math.pow(1 + realExpenseGrowth, year);

    return {
      assetChanges: { cash: -futureExpenses, stocks: 0, bonds: 0 },
      description: `Living expenses: ${futureExpenses.toLocaleString()}`,
      metadata: {
        baseExpenses: annualExpenses,
        growthRate: realExpenseGrowth,
      },
    };
  }
}
