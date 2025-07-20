import { describe, it, expect } from 'vitest';

import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { calculateYearsToFIRE, calculateFIREAge, getFIREAnalysis } from './calculator';

describe('FIRE Calculations', () => {
  // Base test case with complete valid inputs
  const baseInputs: QuickPlanInputs = {
    basics: {
      currentAge: 30,
      annualIncome: 100000,
      annualExpenses: 60000,
      investedAssets: 100000,
    },
    growthRates: {
      incomeGrowthRate: 3,
      expenseGrowthRate: 3,
    },
    allocation: {
      stockAllocation: 70,
      bondAllocation: 30,
      cashAllocation: 0,
    },
    goals: {
      retirementExpenses: 40000,
    },
    marketAssumptions: {
      stockReturn: 10,
      bondReturn: 5,
      cashReturn: 3,
      inflationRate: 3,
    },
    retirementFunding: {
      safeWithdrawalRate: 4,
      retirementIncome: 0,
      lifeExpectancy: 85,
      effectiveTaxRate: 15,
    },
    flexiblePaths: {
      targetRetirementAge: 50,
      partTimeIncome: 0,
    },
  };

  describe('calculateYearsToFIRE', () => {
    it('should calculate years to FIRE for a typical scenario', () => {
      const years = calculateYearsToFIRE(baseInputs);
      // With $100k starting, $40k/year savings (0% real growth), 5.34% real return
      // Need to reach $1M (40k/0.04)
      // Solving: 100k * 1.0534^n + 40k * [(1.0534^n - 1) / 0.0534] ≥ 1M
      // This yields 14 years (portfolio = $1,009,842)
      expect(years).toBe(14);
    });

    it('should return 0 if already achieved FIRE', () => {
      const wealthyInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 2000000, // Already wealthy
        },
      };
      const years = calculateYearsToFIRE(wealthyInputs);
      expect(years).toBe(0);
    });

    it('should return -1 if retirement expenses are missing', () => {
      const invalidInputs: QuickPlanInputs = {
        ...baseInputs,
        goals: {
          ...baseInputs.goals,
          retirementExpenses: null,
        },
      };
      const years = calculateYearsToFIRE(invalidInputs);
      expect(years).toBe(-1);
    });

    it('should handle very low savings rate scenarios', () => {
      const lowSavingsInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 50000,
          annualExpenses: 49000, // $1000/year savings
          investedAssets: 1000,
        },
      };
      const years = calculateYearsToFIRE(lowSavingsInputs, 100);
      // With only $1k starting and $1k/year savings at 5.34% real
      // Need to reach $1M
      // This will take 76 years (portfolio = $1,009,518)
      expect(years).toBe(76);
    });

    it('should handle high savings rate scenarios', () => {
      const highSavingsInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 150000,
          annualExpenses: 30000, // $120k/year savings
        },
      };
      const years = calculateYearsToFIRE(highSavingsInputs);
      // With $100k starting, $120k/year savings, 5.34% real return
      // Need to reach $1M
      // This takes approximately 7 years
      expect(years).toBe(7);
    });

    it('should handle scenario where starting assets alone could reach FIRE', () => {
      const goodStartInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 800000,
          annualIncome: 60000,
          annualExpenses: 60000, // Zero savings
        },
      };
      const years = calculateYearsToFIRE(goodStartInputs);
      // $800k growing at 5.34% real needs to reach $1M
      // 800k * 1.0534^n = 1M
      // n = ln(1.25) / ln(1.0534) ≈ 4.3 years
      expect(years).toBe(5); // Rounds up to 5 years
    });
  });

  describe('calculateFIREAge', () => {
    it('should calculate FIRE age correctly', () => {
      const fireAge = calculateFIREAge(baseInputs);
      // Current age 30 + 14 years to FIRE = 44
      expect(fireAge).toBe(44);
    });

    it('should return current age if already achieved FIRE', () => {
      const wealthyInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 2000000,
        },
      };
      const fireAge = calculateFIREAge(wealthyInputs);
      expect(fireAge).toBe(30);
    });

    it('should return -1 if current age is missing', () => {
      const invalidInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          currentAge: null,
        },
      };
      const fireAge = calculateFIREAge(invalidInputs);
      expect(fireAge).toBe(-1);
    });

    it('should handle very low savings scenarios', () => {
      const lowSavingsInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 40000,
          annualExpenses: 39500, // $500/year savings
          investedAssets: 100,
        },
      };
      const fireAge = calculateFIREAge(lowSavingsInputs);
      // With minimal savings, FIRE takes ~90 years
      // Age 30 + 90 = 120
      expect(fireAge).toBe(120);
    });
  });

  describe('getFIREAnalysis', () => {
    it('should provide complete FIRE analysis for achievable scenario', () => {
      const analysis = getFIREAnalysis(baseInputs);

      expect(analysis.achievable).toBe(true);
      expect(analysis.yearsToFIRE).toBe(14);
      expect(analysis.fireAge).toBe(44);
      expect(analysis.requiredPortfolio).toBe(1000000); // 40k / 0.04
      expect(analysis.currentPortfolio).toBe(100000);
      // After 14 years, portfolio should be just over $1M
      expect(analysis.projectedPortfolioAtFIRE).toBeGreaterThan(1000000);
      expect(analysis.projectedPortfolioAtFIRE).toBeLessThan(1010000);
      expect(analysis.message).toBe('FIRE is achievable in 14 years at age 44.');
    });

    it('should indicate already achieved FIRE', () => {
      const wealthyInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 1500000,
        },
      };
      const analysis = getFIREAnalysis(wealthyInputs);

      expect(analysis.achievable).toBe(true);
      expect(analysis.yearsToFIRE).toBe(0);
      expect(analysis.fireAge).toBe(30);
      expect(analysis.message).toBe('Congratulations! You have already achieved FIRE.');
    });

    it('should handle missing data gracefully', () => {
      const invalidInputs: QuickPlanInputs = {
        ...baseInputs,
        goals: {
          ...baseInputs.goals,
          retirementExpenses: null,
        },
      };
      const analysis = getFIREAnalysis(invalidInputs);

      expect(analysis.achievable).toBe(false);
      expect(analysis.yearsToFIRE).toBe(-1);
      expect(analysis.fireAge).toBe(-1);
      expect(analysis.message).toBe('Missing required data to calculate FIRE goals');
    });

    it('should provide appropriate message for long timeframes', () => {
      const slowInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 60000,
          annualExpenses: 50000, // $10k/year savings
        },
      };
      const analysis = getFIREAnalysis(slowInputs);

      expect(analysis.achievable).toBe(true);
      expect(analysis.yearsToFIRE).toBe(28);
      expect(analysis.message).toBe('FIRE is achievable in 28 years at age 58.');
    });

    it('should calculate correct required portfolio', () => {
      const customInputs: QuickPlanInputs = {
        ...baseInputs,
        goals: {
          ...baseInputs.goals,
          retirementExpenses: 50000,
        },
        retirementFunding: {
          ...baseInputs.retirementFunding,
          safeWithdrawalRate: 3.5,
        },
      };
      const analysis = getFIREAnalysis(customInputs);

      expect(analysis.requiredPortfolio).toBeCloseTo(1428571.43, 2);
    });

    it('should handle quick FIRE scenario with appropriate message', () => {
      const quickFireInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 200000,
          annualExpenses: 40000, // $160k/year savings
          investedAssets: 200000,
        },
      };
      const analysis = getFIREAnalysis(quickFireInputs);

      expect(analysis.achievable).toBe(true);
      expect(analysis.yearsToFIRE).toBe(5);
      expect(analysis.message).toBe('You can achieve FIRE in 5 years at age 35.');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle zero income scenario with negative contributions', () => {
      const zeroIncomeInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 0,
          annualExpenses: 40000, // -$40k/year contribution
          investedAssets: 500000,
        },
      };
      const years = calculateYearsToFIRE(zeroIncomeInputs);
      // $500k with -$40k/year withdrawals at 5.34% real return
      // Portfolio shrinks over time, will never reach $1M
      expect(years).toBe(-1);
    });

    it('should handle scenario where portfolio grows despite negative contributions', () => {
      const withdrawingButGrowingInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          annualIncome: 0,
          annualExpenses: 20000, // -$20k/year contribution
          investedAssets: 900000, // Close to FIRE already
        },
      };
      const years = calculateYearsToFIRE(withdrawingButGrowingInputs);
      // $900k with -$20k/year withdrawals at 5.34% real return
      // Growth: $48k/year, Withdrawal: $20k/year, Net: +$28k/year
      // Should still reach $1M in about 4 years
      expect(years).toBe(4);
    });

    it('should handle very high withdrawal rates', () => {
      const highWithdrawalInputs: QuickPlanInputs = {
        ...baseInputs,
        retirementFunding: {
          ...baseInputs.retirementFunding,
          safeWithdrawalRate: 6, // Very high
        },
      };
      const analysis = getFIREAnalysis(highWithdrawalInputs);

      // Required portfolio = $40k / 0.06 = $666,667
      expect(analysis.requiredPortfolio).toBeCloseTo(666666.67, 2);
      // Easier target means fewer years to FIRE (10 years to reach $679,406)
      expect(analysis.yearsToFIRE).toBe(10);
    });

    it('should handle negative real returns', () => {
      const negativeReturnInputs: QuickPlanInputs = {
        ...baseInputs,
        marketAssumptions: {
          ...baseInputs.marketAssumptions,
          stockReturn: 3,
          bondReturn: 2,
          inflationRate: 5, // Higher than returns
        },
      };
      const years = calculateYearsToFIRE(negativeReturnInputs);
      // Nominal return: 0.7*3% + 0.3*2% = 2.7%
      // Real return: (1.027/1.05) - 1 = -2.19%
      // With negative real returns, portfolio shrinks in real terms
      expect(years).toBe(-1);
    });

    it('should handle exactly meeting FIRE requirements', () => {
      const exactFIREInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 1000000, // Exactly at FIRE
        },
      };
      const years = calculateYearsToFIRE(exactFIREInputs);
      expect(years).toBe(0);
    });

    it('should handle just below FIRE requirements', () => {
      const almostFIREInputs: QuickPlanInputs = {
        ...baseInputs,
        basics: {
          ...baseInputs.basics,
          investedAssets: 999999, // $1 short of FIRE
        },
      };
      const years = calculateYearsToFIRE(almostFIREInputs);
      // Should need 1 year to make up the difference with growth/contributions
      expect(years).toBe(1);
    });
  });
});
