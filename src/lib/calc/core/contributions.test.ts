import { describe, it, expect, vi } from 'vitest';

import { defaultState } from '@/lib/stores/quick-plan-store';

import { calculateYearlyContribution } from './contributions';

describe('calculateYearlyContribution', () => {
  it('should calculate correct contribution for year 0 (base year)', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 3,
        expenseGrowthRate: 3,
      },
    };

    const result = calculateYearlyContribution(inputs, 0);

    // Year 0: 100,000 - 60,000 = 40,000
    expect(result).toBe(40000);
  });

  it('should calculate correct contribution for year 1 with growth equal to inflation', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 3,
        expenseGrowthRate: 3,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        inflationRate: 3,
      },
    };

    const result = calculateYearlyContribution(inputs, 1);

    // With 3% nominal growth and 3% inflation, real growth is 0%
    // Year 1: (100,000 × 1.0) - (60,000 × 1.0) = 100,000 - 60,000 = 40,000
    expect(result).toBe(40000);
  });

  it('should calculate correct contribution for year 1 with positive real growth', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 5, // 5% nominal
        expenseGrowthRate: 5, // 5% nominal
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        inflationRate: 3,
      },
    };

    const result = calculateYearlyContribution(inputs, 1);

    // Real growth = (1.05 / 1.03) - 1 = 0.0194 = 1.94%
    // Year 1: (100,000 × 1.0194) - (60,000 × 1.0194) = 101,940 - 61,164 = 40,776
    expect(result).toBeCloseTo(40776.7, 1);
  });

  it('should handle different growth rates for income and expenses', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 5, // Higher income growth (nominal)
        expenseGrowthRate: 2, // Lower expense growth (nominal)
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        inflationRate: 3,
      },
    };

    const result = calculateYearlyContribution(inputs, 1);

    // Real income growth: (1.05 / 1.03) - 1 = 0.0194 = 1.94%
    // Real expense growth: (1.02 / 1.03) - 1 = -0.0097 = -0.97%
    // Year 1: (100,000 × 1.0194) - (60,000 × 0.9903) = 101,941.75 - 59,417.48 = 42,524.27
    expect(result).toBeCloseTo(42524.27, 2);
  });

  it('should handle multiple years with compounding when growth equals inflation', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 3,
        expenseGrowthRate: 3,
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        inflationRate: 3,
      },
    };

    const result = calculateYearlyContribution(inputs, 5);

    // With 3% nominal growth and 3% inflation, real growth is 0%
    // Year 5: (100,000 × 1.0^5) - (60,000 × 1.0^5) = 100,000 - 60,000 = 40,000
    expect(result).toBe(40000);
  });

  it('should return null when annualIncome is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: null,
        annualExpenses: 60000,
      },
    };

    const result = calculateYearlyContribution(inputs, 1);

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate yearly contribution: annual income and expenses are required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });

  it('should return null when annualExpenses is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: null,
      },
    };

    const result = calculateYearlyContribution(inputs, 1);

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate yearly contribution: annual income and expenses are required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });

  it('should handle negative contribution (expenses exceed income)', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 50000,
        annualExpenses: 60000, // Spending more than earning
      },
      growthRates: {
        incomeGrowthRate: 2,
        expenseGrowthRate: 4, // Expenses growing faster (nominal)
      },
      marketAssumptions: {
        ...defaultState.inputs.marketAssumptions,
        inflationRate: 3,
      },
    };

    const result0 = calculateYearlyContribution(inputs, 0);
    const result1 = calculateYearlyContribution(inputs, 1);

    // Year 0: 50,000 - 60,000 = -10,000
    expect(result0).toBe(-10000);

    // Real income growth: (1.02 / 1.03) - 1 = -0.97%
    // Real expense growth: (1.04 / 1.03) - 1 = 0.97%
    // Year 1: (50,000 × 0.9903) - (60,000 × 1.0097) = 49,514.56 - 60,582.52 = -11,067.96
    expect(result1).toBeCloseTo(-11067.96, 2);
  });
});
