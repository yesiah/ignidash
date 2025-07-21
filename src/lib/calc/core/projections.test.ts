import { describe, it, expect, vi } from 'vitest';

import { defaultState } from '@/lib/stores/quick-plan-store';

import { calculateRequiredPortfolio, calculateFuturePortfolioValue } from './projections';

describe('calculateRequiredPortfolio', () => {
  it('should return 1,000,000 for 40,000 retirement expenses with 4% SWR', () => {
    const result = calculateRequiredPortfolio(40000, 4);
    expect(result).toBe(1000000);
  });

  it('should warn and return -1 when retirementExpenses is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = calculateRequiredPortfolio(null, 4);

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate required portfolio: retirement expenses is required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });
});

describe('calculateFuturePortfolioValue', () => {
  it('should calculate correct future value with positive real returns and contributions', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: 100000,
        annualIncome: 80000,
        annualExpenses: 50000,
      },
      allocation: {
        stockAllocation: 70,
        bondAllocation: 30,
        cashAllocation: 0,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        stockReturn: 10,
        bondReturn: 5,
        cashReturn: 3,
        inflationRate: 3,
      },
      growthRates: {
        incomeGrowthRate: 3, // Nominal growth
        expenseGrowthRate: 3, // Nominal growth
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 5);

    // Since growth rates are nominal (3%) and inflation is 3%, real growth is 0%
    // Real return: 5.3398% (from nominal 8.5% and 3% inflation)
    // Initial assets after 5 years: 100,000 × (1.053398)^5 = 129,706.75
    //
    // Contributions stay constant at 30,000 in real terms (0% real growth):
    // Year 0: 30,000 × (1.053398)^4 = 36,939.53
    // Year 1: 30,000 × (1.053398)^3 = 35,067.01
    // Year 2: 30,000 × (1.053398)^2 = 33,289.42
    // Year 3: 30,000 × (1.053398)^1 = 31,601.94
    // Year 4: 30,000 × (1.053398)^0 = 30,000.00
    // Total contributions FV: 166,897.91
    //
    // Total: 129,706.75 + 166,897.91 = 296,604.65

    expect(result).toBeCloseTo(296604.65, 0);
  });

  it('should calculate correct future value when growth equals inflation (0% real growth)', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: 100000,
        annualIncome: 80000,
        annualExpenses: 50000,
      },
      allocation: {
        stockAllocation: 70,
        bondAllocation: 30,
        cashAllocation: 0,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        stockReturn: 10,
        bondReturn: 5,
        cashReturn: 3,
        inflationRate: 3,
      },
      growthRates: {
        incomeGrowthRate: 3, // Same as inflation = 0% real growth
        expenseGrowthRate: 3, // Same as inflation = 0% real growth
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 5);

    // Real return: 5.3398% (from nominal 8.5% and 3% inflation)
    // Initial assets after 5 years: 100,000 × (1.053398)^5 = 129,706.75
    //
    // Contributions stay constant at 30,000 in real terms (0% real growth):
    // Year 0: 30,000 × (1.053398)^4 = 36,939.53
    // Year 1: 30,000 × (1.053398)^3 = 35,067.01
    // Year 2: 30,000 × (1.053398)^2 = 33,289.42
    // Year 3: 30,000 × (1.053398)^1 = 31,601.94
    // Year 4: 30,000 × (1.053398)^0 = 30,000.00
    // Total contributions FV: 166,897.91
    //
    // Total: 129,706.75 + 166,897.91 = 296,604.65

    expect(result).toBeCloseTo(296604.65, 0);
  });

  it('should handle zero real return scenario (100% cash with inflation = cash return)', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: 100000,
        annualIncome: 80000,
        annualExpenses: 50000,
      },
      allocation: {
        stockAllocation: 0,
        bondAllocation: 0,
        cashAllocation: 100,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        stockReturn: 10,
        bondReturn: 5,
        cashReturn: 3,
        inflationRate: 3, // Same as cash return = 0% real return
      },
      growthRates: {
        incomeGrowthRate: 3, // With 3% inflation, this is 0% real growth
        expenseGrowthRate: 3, // With 3% inflation, this is 0% real growth
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 5);

    // With 0% real return and 0% real growth on contributions
    // Initial assets: 100,000 (no real growth)
    // Contributions: 30,000 per year × 5 years = 150,000
    // Total: 100,000 + 150,000 = 250,000

    expect(result).toBe(250000);
  });

  it('should handle negative contributions in later years when expenses grow faster than income', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: 500000,
        annualIncome: 60000,
        annualExpenses: 55000, // Close to income
      },
      allocation: {
        stockAllocation: 60,
        bondAllocation: 40,
        cashAllocation: 0,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        stockReturn: 10,
        bondReturn: 5,
        cashReturn: 3,
        inflationRate: 3,
      },
      growthRates: {
        incomeGrowthRate: 1, // Income grows slowly (nominal)
        expenseGrowthRate: 4, // Expenses grow faster (nominal)
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 10);

    // Real return: (1.07 / 1.03) - 1 = 3.883%
    // Real income growth: (1.01 / 1.03) - 1 = -1.94%
    // Real expense growth: (1.04 / 1.03) - 1 = 0.97%
    //
    // Contributions turn negative as expenses grow faster than income in real terms
    // Assets should grow but be reduced by negative contributions (withdrawals)

    expect(result).toBeGreaterThan(500000); // Should still grow due to returns
    expect(result).toBeLessThan(800000); // But limited by withdrawals
  });

  it('should return -1 when investedAssets is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: null,
        annualIncome: 80000,
        annualExpenses: 50000,
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 5);

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate future portfolio value: invested assets is required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });

  it('should return -1 when calculateYearlyContribution returns -1', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        investedAssets: 100000,
        annualIncome: null, // This will cause calculateYearlyContribution to return -1
        annualExpenses: 50000,
      },
    };

    const result = calculateFuturePortfolioValue(inputs, 5);

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate yearly contribution: annual income and expenses are required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });
});
