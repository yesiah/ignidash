import * as Comlink from 'comlink';

import type { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';
import {
  MonteCarloSimulationEngine,
  LcgHistoricalBacktestSimulationEngine,
  type MultiSimulationResult,
} from '@/lib/calc/v2/simulation-engine';
import { MultiSimulationAnalyzer, type MultiSimulationAnalysis } from '../calc/v2/multi-simulation-analyzer';

const simulationAPI = {
  async runMonteCarloSimulation(inputs: QuickPlanInputs, baseSeed: number, numSimulations: number): Promise<MultiSimulationResult> {
    const engine = new MonteCarloSimulationEngine(inputs, baseSeed);
    const res = engine.runMonteCarloSimulation(numSimulations);

    return res;
  },

  async runHistoricalBacktestSimulation(inputs: QuickPlanInputs, baseSeed: number, numSimulations: number): Promise<MultiSimulationResult> {
    const engine = new LcgHistoricalBacktestSimulationEngine(inputs, baseSeed);
    const res = engine.runLcgHistoricalBacktest(numSimulations);

    return res;
  },

  async analyzeMonteCarloSimulation(inputs: QuickPlanInputs, baseSeed: number, numSimulations: number): Promise<MultiSimulationAnalysis> {
    const engine = new MonteCarloSimulationEngine(inputs, baseSeed);
    const res = engine.runMonteCarloSimulation(numSimulations);

    const analyzer = new MultiSimulationAnalyzer();
    return analyzer.analyze(res);
  },

  async analyzeHistoricalBacktestSimulation(
    inputs: QuickPlanInputs,
    baseSeed: number,
    numSimulations: number
  ): Promise<MultiSimulationAnalysis> {
    const engine = new LcgHistoricalBacktestSimulationEngine(inputs, baseSeed);
    const res = engine.runLcgHistoricalBacktest(numSimulations);

    const analyzer = new MultiSimulationAnalyzer();
    return analyzer.analyze(res);
  },

  async generateMonteCarloTableData(inputs: QuickPlanInputs, baseSeed: number, numSimulations: number): Promise<never[]> {
    throw new Error('Not implemented yet');
  },

  async generateHistoricalBacktestTableData(inputs: QuickPlanInputs, baseSeed: number, numSimulations: number): Promise<never[]> {
    throw new Error('Not implemented yet');
  },
};

Comlink.expose(simulationAPI);

export type SimulationWorkerAPI = typeof simulationAPI;
