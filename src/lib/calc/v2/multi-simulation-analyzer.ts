import type { MultiSimulationResult, SimulationResult } from '@/lib/calc/v2/simulation-engine';

export interface Stats {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number | null;
}

export interface Percentiles {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface MultiSimulationAnalysis {
  p10Result: SimulationResult;
  p25Result: SimulationResult;
  medianResult: SimulationResult;
  p75Result: SimulationResult;
  p90Result: SimulationResult;
}

export class MultiSimulationAnalyzer {
  analyze(multiSimulationResult: MultiSimulationResult): MultiSimulationAnalysis {
    throw new Error('Not implemented yet');
  }

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

  private calculateMedian(sortedValues: number[]): number {
    const length = sortedValues.length;
    if (length % 2 === 0) {
      return (sortedValues[length / 2 - 1] + sortedValues[length / 2]) / 2;
    } else {
      return sortedValues[Math.floor(length / 2)];
    }
  }

  private calculateStandardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = Math.floor((percentile / 100) * sortedValues.length);
    return sortedValues[Math.min(index, sortedValues.length - 1)];
  }

  private calculatePercentilesFromValues(sortedValues: number[]): Percentiles {
    return {
      p10: this.calculatePercentile(sortedValues, 10),
      p25: this.calculatePercentile(sortedValues, 25),
      p50: this.calculatePercentile(sortedValues, 50),
      p75: this.calculatePercentile(sortedValues, 75),
      p90: this.calculatePercentile(sortedValues, 90),
    };
  }
}
