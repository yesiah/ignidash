import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

export interface CashFlow {
  readonly id: string;
  readonly name: string;

  shouldApply(year: number, currentAge: number, inputs: QuickPlanInputs): boolean;
  calculateChange(year: number, currentAge: number, inputs: QuickPlanInputs): number;
}

export class AnnualIncome implements CashFlow {
  id = 'annual-income';
  name = 'Annual Income';

  shouldApply(_year: number, _currentAge: number, _inputs: QuickPlanInputs): boolean {
    return true;
  }

  calculateChange(year: number, _currentAge: number, inputs: QuickPlanInputs): number {
    const { annualIncome } = inputs.basics;
    if (!annualIncome) {
      return 0;
    }

    // Convert nominal growth to real growth
    const { incomeGrowthRate } = inputs.growthRates;
    const realIncomeGrowth = (1 + incomeGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;

    // Calculate future income
    return annualIncome * Math.pow(1 + realIncomeGrowth, year);
  }
}

export class AnnualExpenses implements CashFlow {
  id = 'annual-expenses';
  name = 'Annual Expenses';

  shouldApply(_year: number, _currentAge: number, _inputs: QuickPlanInputs): boolean {
    return true;
  }

  calculateChange(year: number, _currentAge: number, inputs: QuickPlanInputs): number {
    const { annualExpenses } = inputs.basics;
    if (!annualExpenses) {
      return 0;
    }

    // Convert nominal growth to real growth
    const { expenseGrowthRate } = inputs.growthRates;
    const realExpenseGrowth = (1 + expenseGrowthRate / 100) / (1 + inputs.marketAssumptions.inflationRate / 100) - 1;

    // Calculate future expenses
    const futureExpenses = annualExpenses * Math.pow(1 + realExpenseGrowth, year);

    return -futureExpenses;
  }
}

export class PassiveRetirementIncome implements CashFlow {
  id = 'passive-retirement-income';
  name = 'Passive Retirement Income';

  shouldApply(_year: number, currentAge: number, _inputs: QuickPlanInputs): boolean {
    return currentAge >= 62;
  }

  calculateChange(_year: number, _currentAge: number, inputs: QuickPlanInputs): number {
    const { retirementIncome, effectiveTaxRate } = inputs.retirementFunding;
    return retirementIncome * (1 - effectiveTaxRate / 100);
  }
}

export class RetirementExpenses implements CashFlow {
  id = 'retirement-expenses';
  name = 'Retirement Expenses';

  shouldApply(_year: number, _currentAge: number, _inputs: QuickPlanInputs): boolean {
    return true;
  }

  calculateChange(year: number, _currentAge: number, inputs: QuickPlanInputs): number {
    const { retirementExpenses } = inputs.goals;
    return retirementExpenses ?? 0;
  }
}
