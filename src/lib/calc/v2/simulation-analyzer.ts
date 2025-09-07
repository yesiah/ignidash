import type { SimulationResult /* SimulationDataPoint */ } from './simulation-engine';
// import type { PortfolioData } from './portfolio';
// import type { PhaseData } from './phase';
// import type { ReturnsData } from './returns';
// import type { IncomesData } from './incomes';
// import type { ExpensesData } from './expenses';
// import type { TaxesData } from './taxes';

/**
 * Core statistical measures for asset or portfolio values
 */
export interface Stats {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number | null;
}

/**
 * Percentile distribution for statistical analysis
 */
export interface Percentiles {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

/**
 * Distribution data showing how many values fall between percentile ranges
 */
export interface PercentileDistribution {
  belowP10: number;
  p10toP25: number;
  p25toP50: number;
  p50toP75: number;
  p75toP90: number;
  aboveP90: number;
}

export class SimulationAnalyzer {
  analyzeSimulation(result: SimulationResult): void {
    // Perform analysis on the simulation result
  }

  analyzeSimulations(results: SimulationResult[]): void {
    // Extract data points from the simulation result
  }

  /**
   * Calculates standard statistical measures for a dataset
   *
   * @param values - Array of numerical values to analyze
   * @returns Statistical measures (mean, median, min, max, stdDev) or null if empty
   */
  private calculateStats(values: number[]): Stats | null {
    if (values.length === 0) return null;
    if (values.length === 1) return { mean: values[0], median: values[0], min: values[0], max: values[0], stdDev: null };

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = this.calculateMedian(sorted);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const stdDev = this.calculateStandardDeviation(values, mean);

    return { mean, median, min, max, stdDev };
  }

  /**
   * Calculates median value from a sorted array
   *
   * @param sortedValues - Pre-sorted array of numerical values
   * @returns Median value
   */
  private calculateMedian(sortedValues: number[]): number {
    const length = sortedValues.length;
    if (length % 2 === 0) {
      return (sortedValues[length / 2 - 1] + sortedValues[length / 2]) / 2;
    } else {
      return sortedValues[Math.floor(length / 2)];
    }
  }

  /**
   * Calculates standard deviation for a dataset
   *
   * @param values - Array of numerical values
   * @param mean - Pre-calculated mean of the dataset
   * @returns Standard deviation
   */
  private calculateStandardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  /**
   * Calculates percentile value from a sorted array
   *
   * @param sortedValues - Pre-sorted array of numerical values
   * @param percentile - Percentile to calculate (0-100)
   * @returns Value at the specified percentile
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = Math.floor((percentile / 100) * sortedValues.length);
    return sortedValues[Math.min(index, sortedValues.length - 1)];
  }

  /**
   * Calculates all standard percentiles from a sorted array
   *
   * @param sortedValues - Pre-sorted array of numerical values
   * @returns Standard percentiles (p10, p25, p50, p75, p90)
   */
  private calculatePercentilesFromValues(sortedValues: number[]): Percentiles {
    return {
      p10: this.calculatePercentile(sortedValues, 10),
      p25: this.calculatePercentile(sortedValues, 25),
      p50: this.calculatePercentile(sortedValues, 50),
      p75: this.calculatePercentile(sortedValues, 75),
      p90: this.calculatePercentile(sortedValues, 90),
    };
  }

  /**
   * Calculates distribution of values across percentile ranges
   *
   * @param sortedValues - Pre-sorted array of numerical values
   * @param percentiles - Calculated percentile values
   * @returns Count of values in each percentile range
   */
  private calculatePercentileDistribution(sortedValues: number[], percentiles: Percentiles): PercentileDistribution {
    return {
      belowP10: sortedValues.filter((v) => v <= percentiles.p10).length,
      p10toP25: sortedValues.filter((v) => v > percentiles.p10 && v <= percentiles.p25).length,
      p25toP50: sortedValues.filter((v) => v > percentiles.p25 && v <= percentiles.p50).length,
      p50toP75: sortedValues.filter((v) => v > percentiles.p50 && v <= percentiles.p75).length,
      p75toP90: sortedValues.filter((v) => v > percentiles.p75 && v <= percentiles.p90).length,
      aboveP90: sortedValues.filter((v) => v > percentiles.p90).length,
    };
  }
}
