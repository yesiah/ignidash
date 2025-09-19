import type { MultiSimulationResult, SimulationResult } from '@/lib/calc/v2/simulation-engine';

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
}
