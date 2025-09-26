import * as Comlink from 'comlink';

import type { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';
import {
  MonteCarloSimulationEngine,
  LcgHistoricalBacktestSimulationEngine,
  type MultiSimulationResult,
} from '@/lib/calc/v2/simulation-engine';

const simulationAPI = {
  async analyzeMonteCarloSimulation(
    inputs: QuickPlanInputs,
    baseSeed: number,
    numSimulations: number,
    simulationMode: 'monteCarloStochasticReturns' | 'monteCarloHistoricalReturns'
  ): Promise<MultiSimulationResult> {
    switch (simulationMode) {
      case 'monteCarloStochasticReturns': {
        const engine = new MonteCarloSimulationEngine(inputs, baseSeed);
        return engine.runMonteCarloSimulation(numSimulations);
      }
      case 'monteCarloHistoricalReturns': {
        const engine = new LcgHistoricalBacktestSimulationEngine(inputs, baseSeed);
        return engine.runLcgHistoricalBacktest(numSimulations);
      }
    }
  },
};

Comlink.expose(simulationAPI);

export type SimulationWorkerAPI = typeof simulationAPI;
