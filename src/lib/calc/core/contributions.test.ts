import { describe, it, expect, vi } from 'vitest';

import { defaultState } from '@/lib/stores/quick-plan-store';

import { calculateYearlyContribution } from './contributions';

describe('calculateYearlyContribution', () => {
  it('should calculate correct contribution for year 0 (base year) with nominal values', () => {
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

    const result = calculateYearlyContribution(inputs, 0, true); // true for nominal

    // Year 0: 100,000 - 60,000 = 40,000
    expect(result).toBe(40000);
  });

  it('should calculate correct contribution for year 1 with nominal values', () => {
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

    const result = calculateYearlyContribution(inputs, 1, true); // true for nominal

    // Year 1: (100,000 × 1.03) - (60,000 × 1.03) = 103,000 - 61,800 = 41,200
    expect(result).toBe(41200);
  });

  it('should calculate correct contribution for year 1 with real values', () => {
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

    const result = calculateYearlyContribution(inputs, 1, false); // false for real

    // Real growth = (1.05 / 1.03) - 1 = 0.0194 = 1.94%
    // Year 1: (100,000 × 1.0194) - (60,000 × 1.0194) = 101,940 - 61,164 = 40,776
    expect(result).toBeCloseTo(40776.7, 1);
  });

  it('should handle different growth rates for income and expenses with nominal values', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: 60000,
      },
      growthRates: {
        incomeGrowthRate: 5, // Higher income growth
        expenseGrowthRate: 2, // Lower expense growth
      },
    };

    const result = calculateYearlyContribution(inputs, 1, true); // true for nominal

    // Year 1: (100,000 × 1.05) - (60,000 × 1.02) = 105,000 - 61,200 = 43,800
    expect(result).toBe(43800);
  });

  it('should handle multiple years with compounding using nominal values', () => {
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

    const result = calculateYearlyContribution(inputs, 5, true); // true for nominal

    // Year 5: (100,000 × 1.03^5) - (60,000 × 1.03^5)
    // = (100,000 × 1.159274) - (60,000 × 1.159274)
    // = 115,927.4 - 69,556.44 = 46,370.96
    expect(result).toBeCloseTo(46370.96, 2);
  });

  it('should return -1 when annualIncome is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: null,
        annualExpenses: 60000,
      },
    };

    const result = calculateYearlyContribution(inputs, 1, true); // true for nominal

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate yearly contribution: annual income and expenses are required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });

  it('should return -1 when annualExpenses is null', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 100000,
        annualExpenses: null,
      },
    };

    const result = calculateYearlyContribution(inputs, 1, true); // true for nominal

    expect(consoleSpy).toHaveBeenCalledWith('Cannot calculate yearly contribution: annual income and expenses are required');
    expect(result).toBe(null);
    consoleSpy.mockRestore();
  });

  it('should handle negative contribution (expenses exceed income) with nominal values', () => {
    const inputs = {
      ...defaultState.inputs,
      basics: {
        ...defaultState.inputs.basics,
        annualIncome: 50000,
        annualExpenses: 60000, // Spending more than earning
      },
      growthRates: {
        incomeGrowthRate: 2,
        expenseGrowthRate: 4, // Expenses growing faster
      },
    };

    const result0 = calculateYearlyContribution(inputs, 0, true); // true for nominal
    const result1 = calculateYearlyContribution(inputs, 1, true); // true for nominal

    // Year 0: 50,000 - 60,000 = -10,000
    expect(result0).toBe(-10000);

    // Year 1: (50,000 × 1.02) - (60,000 × 1.04) = 51,000 - 62,400 = -11,400
    expect(result1).toBe(-11400);
  });
});
