import { describe, it, expect } from 'vitest';

import { SimulationDataExtractor } from './simulation-data-extractor';
import type { SimulationResult, SimulationDataPoint } from '../simulation-engine';
import type { ReturnsData } from '../returns';

/**
 * Tests for SimulationDataExtractor.getMeanReturnsData
 *
 * This method uses GEOMETRIC MEAN for calculating average returns, not arithmetic mean.
 *
 * Why geometric mean is correct for investment returns:
 * - Returns compound multiplicatively, not additively
 * - Geometric mean reflects the actual compounded growth rate
 *
 * Classic example: +50% then -50%
 * - Arithmetic mean: (0.50 + -0.50) / 2 = 0% (suggests no change)
 * - Geometric mean: √(1.50 × 0.50) - 1 = √0.75 - 1 ≈ -13.4%
 * - Reality: $100 → $150 → $75 (you lost 25% total, or ~13.4% annualized)
 */

// Helper to create minimal ReturnsData with specified annual returns
const createReturnsData = (returns: { stocks: number; bonds: number; cash: number; inflation: number }): ReturnsData => ({
  annualReturnRates: {
    stocks: returns.stocks,
    bonds: returns.bonds,
    cash: returns.cash,
  },
  annualYieldRates: { stocks: 0, bonds: 0, cash: 0 },
  annualInflationRate: returns.inflation,
  returnAmountsForPeriod: { stocks: 0, bonds: 0, cash: 0 },
  returnRatesForPeriod: { stocks: 0, bonds: 0, cash: 0 },
  cumulativeReturnAmounts: { stocks: 0, bonds: 0, cash: 0 },
  yieldAmountsForPeriod: {
    taxable: { stocks: 0, bonds: 0, cash: 0 },
    taxDeferred: { stocks: 0, bonds: 0, cash: 0 },
    taxFree: { stocks: 0, bonds: 0, cash: 0 },
    cashSavings: { stocks: 0, bonds: 0, cash: 0 },
  },
  yieldRatesForPeriod: { stocks: 0, bonds: 0, cash: 0 },
  cumulativeYieldAmounts: {
    taxable: { stocks: 0, bonds: 0, cash: 0 },
    taxDeferred: { stocks: 0, bonds: 0, cash: 0 },
    taxFree: { stocks: 0, bonds: 0, cash: 0 },
    cashSavings: { stocks: 0, bonds: 0, cash: 0 },
  },
  inflationRateForPeriod: 0,
  perAccountData: {},
});

// Helper to create minimal SimulationDataPoint
const createDataPoint = (age: number, returns: ReturnsData | null, phase: 'accumulation' | 'retirement'): SimulationDataPoint => ({
  date: '2024-01-01',
  age,
  portfolio: {
    totalValue: 100000,
    assetAllocation: { stocks: 0.6, bonds: 0.3, cash: 0.1 },
    contributionsForPeriod: { stocks: 0, bonds: 0, cash: 0 },
    withdrawalsForPeriod: { stocks: 0, bonds: 0, cash: 0 },
    cumulativeContributions: { stocks: 0, bonds: 0, cash: 0 },
    cumulativeWithdrawals: { stocks: 0, bonds: 0, cash: 0 },
    employerMatchForPeriod: 0,
    cumulativeEmployerMatch: 0,
    realizedGainsForPeriod: 0,
    cumulativeRealizedGains: 0,
    rmdsForPeriod: 0,
    cumulativeRmds: 0,
    earningsWithdrawnForPeriod: 0,
    cumulativeEarningsWithdrawn: 0,
    shortfallForPeriod: 0,
    shortfallRepaidForPeriod: 0,
    outstandingShortfall: 0,
    perAccountData: {},
  },
  incomes: null,
  expenses: null,
  taxes: null,
  returns,
  phase: { name: phase },
});

// Helper to create minimal SimulationResult with specified returns
const createSimulationResult = (
  annualReturns: { stocks: number; bonds: number; cash: number; inflation: number }[],
  retirementYearIndex?: number
): SimulationResult => {
  const startAge = 30;
  const endAge = startAge + annualReturns.length;

  // First data point is year 0 (no returns)
  const data: SimulationDataPoint[] = [createDataPoint(startAge, null, 'accumulation')];

  // Add data points for each year with returns
  annualReturns.forEach((returns, index) => {
    const yearIndex = index + 1;
    const age = startAge + yearIndex;
    const isRetired = retirementYearIndex !== undefined && yearIndex >= retirementYearIndex;

    data.push(createDataPoint(age, createReturnsData(returns), isRetired ? 'retirement' : 'accumulation'));
  });

  return {
    data,
    context: {
      startAge,
      endAge,
      yearsToSimulate: annualReturns.length,
      startDate: '2024-01-01',
      endDate: '2054-01-01',
      retirementStrategy: { type: 'fixedAge', retirementAge: 65 },
      rmdAge: 73,
    },
  };
};

describe('SimulationDataExtractor.getMeanReturnsData', () => {
  it('geometric mean correctly handles the classic +50%/-50% case that arithmetic mean gets wrong', () => {
    // This is THE key test case that demonstrates why geometric mean is necessary
    // +50% then -50%: $100 → $150 → $75 (lost 25%, or ~13.4% annualized)
    const result = createSimulationResult([
      { stocks: 0.5, bonds: 0, cash: 0, inflation: 0 },
      { stocks: -0.5, bonds: 0, cash: 0, inflation: 0 },
    ]);

    const { meanStockReturn } = SimulationDataExtractor.getMeanReturnsData(result, null);

    // Geometric mean: (1.50 * 0.50)^(1/2) - 1 ≈ -0.134
    const expectedGeometricMean = Math.pow(1.5 * 0.5, 1 / 2) - 1;
    expect(meanStockReturn).toBeCloseTo(expectedGeometricMean, 6);

    // Arithmetic mean would incorrectly give 0%
    const arithmeticMean = (0.5 + -0.5) / 2;
    expect(arithmeticMean).toBe(0);
    expect(meanStockReturn).not.toBeCloseTo(arithmeticMean, 2);
  });

  it('geometric mean reflects actual compounded growth rate', () => {
    // 10% return each year for 3 years should give exactly 10% geometric mean
    const result = createSimulationResult([
      { stocks: 0.1, bonds: 0.05, cash: 0.02, inflation: 0.03 },
      { stocks: 0.1, bonds: 0.05, cash: 0.02, inflation: 0.03 },
      { stocks: 0.1, bonds: 0.05, cash: 0.02, inflation: 0.03 },
    ]);

    const stats = SimulationDataExtractor.getMeanReturnsData(result, null);

    expect(stats.meanStockReturn).toBeCloseTo(0.1, 6);
    expect(stats.meanBondReturn).toBeCloseTo(0.05, 6);
    expect(stats.meanCashReturn).toBeCloseTo(0.02, 6);
    expect(stats.meanInflationRate).toBeCloseTo(0.03, 6);
  });

  it('geometric mean is always less than arithmetic mean for varying returns', () => {
    // Mathematical property: GM ≤ AM (equality only when all values are equal)
    const returns = [0.15, 0.08, 0.12, 0.05, 0.2];
    const result = createSimulationResult(returns.map((r) => ({ stocks: r, bonds: 0, cash: 0, inflation: 0 })));

    const { meanStockReturn } = SimulationDataExtractor.getMeanReturnsData(result, null);

    const arithmeticMean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    expect(meanStockReturn).toBeLessThan(arithmeticMean);
  });

  it('higher volatility leads to lower geometric mean (volatility drag)', () => {
    // High volatility: big swings, Low volatility: smaller swings, similar arithmetic mean
    const highVolReturns = [0.3, -0.2, 0.25, -0.15, 0.2];
    const lowVolReturns = [0.1, 0.06, 0.08, 0.07, 0.09];

    const highVolResult = createSimulationResult(highVolReturns.map((r) => ({ stocks: r, bonds: 0, cash: 0, inflation: 0 })));
    const lowVolResult = createSimulationResult(lowVolReturns.map((r) => ({ stocks: r, bonds: 0, cash: 0, inflation: 0 })));

    const highVolStats = SimulationDataExtractor.getMeanReturnsData(highVolResult, null);
    const lowVolStats = SimulationDataExtractor.getMeanReturnsData(lowVolResult, null);

    expect(highVolStats.meanStockReturn).toBeLessThan(lowVolStats.meanStockReturn!);
  });

  it('geometric mean matches manual portfolio growth calculation', () => {
    // Verify geometric mean gives same result as actually compounding an investment
    const returns = [0.12, -0.08, 0.15, 0.03, 0.09];
    const result = createSimulationResult(returns.map((r) => ({ stocks: r, bonds: 0, cash: 0, inflation: 0 })));

    const { meanStockReturn } = SimulationDataExtractor.getMeanReturnsData(result, null);

    // Calculate actual ending value of $1 invested
    let value = 1;
    for (const r of returns) {
      value *= 1 + r;
    }

    // Value using geometric mean for 5 years should equal actual compounded value
    const valueUsingGeoMean = Math.pow(1 + meanStockReturn!, 5);
    expect(valueUsingGeoMean).toBeCloseTo(value, 6);
  });

  it('correctly tracks minimum and maximum stock returns', () => {
    const result = createSimulationResult([
      { stocks: 0.05, bonds: 0, cash: 0, inflation: 0 },
      { stocks: -0.2, bonds: 0, cash: 0, inflation: 0 }, // Min
      { stocks: 0.3, bonds: 0, cash: 0, inflation: 0 }, // Max
      { stocks: 0.1, bonds: 0, cash: 0, inflation: 0 },
    ]);

    const stats = SimulationDataExtractor.getMeanReturnsData(result, null);

    expect(stats.minStockReturn).toBe(-0.2);
    expect(stats.maxStockReturn).toBe(0.3);
  });

  it('calculates geometric mean for early retirement years', () => {
    const returns = [
      { stocks: 0.1, bonds: 0.05, cash: 0.02, inflation: 0.03 }, // Year 1: accumulation
      { stocks: 0.08, bonds: 0.05, cash: 0.02, inflation: 0.03 }, // Year 2: retirement starts
      { stocks: 0.15, bonds: 0.05, cash: 0.02, inflation: 0.03 }, // Year 3: early retirement
      { stocks: -0.1, bonds: 0.05, cash: 0.02, inflation: 0.03 }, // Year 4: early retirement
      { stocks: 0.2, bonds: 0.05, cash: 0.02, inflation: 0.03 }, // Year 5: early retirement
    ];

    const result = createSimulationResult(returns, 2);
    const retirementAge = 30 + 2;

    const stats = SimulationDataExtractor.getMeanReturnsData(result, retirementAge);

    // Early retirement: ages 33, 34, 35 (years where age > 32 AND age < 37)
    const earlyRetReturns = [0.15, -0.1, 0.2];
    const product = earlyRetReturns.reduce((p, r) => p * (1 + r), 1);
    const expectedGeoMean = Math.pow(product, 1 / earlyRetReturns.length) - 1;

    expect(stats.earlyRetirementStockReturn).toBeCloseTo(expectedGeoMean, 6);
  });

  it('returns null for mean values when no data points', () => {
    const result = createSimulationResult([]);

    const stats = SimulationDataExtractor.getMeanReturnsData(result, null);

    expect(stats.meanStockReturn).toBeNull();
    expect(stats.meanBondReturn).toBeNull();
    expect(stats.meanCashReturn).toBeNull();
    expect(stats.meanInflationRate).toBeNull();
  });

  it('handles zero returns correctly', () => {
    const result = createSimulationResult([
      { stocks: 0, bonds: 0, cash: 0, inflation: 0 },
      { stocks: 0, bonds: 0, cash: 0, inflation: 0 },
    ]);

    const stats = SimulationDataExtractor.getMeanReturnsData(result, null);

    expect(stats.meanStockReturn).toBe(0);
    expect(stats.meanBondReturn).toBe(0);
  });
});
