import * as Comlink from 'comlink';
import { v4 as uuidv4 } from 'uuid';

import type { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';
import { MultiSimulationAnalyzer, type MultiSimulationAnalysis } from '@/lib/calc/v2/multi-simulation-analyzer';
import type { MultiSimulationTableRow, YearlyAggregateTableRow } from '@/lib/schemas/multi-simulation-table-schema';
import { TableDataExtractor } from '@/lib/calc/v2/table-data-extractor';
import { SimulationCategory } from '@/lib/types/simulation-category';
import {
  MonteCarloSimulationEngine,
  LcgHistoricalBacktestSimulationEngine,
  type MultiSimulationResult,
} from '@/lib/calc/v2/simulation-engine';

type CacheEntry = { handle: string; res: MultiSimulationResult };
let cache: CacheEntry | null = null;

const simulationAPI = {
  async runSimulation(
    inputs: QuickPlanInputs,
    baseSeed: number,
    numSimulations: number,
    simulationMode: 'monteCarloStochasticReturns' | 'monteCarloHistoricalReturns'
  ): Promise<{ handle: string }> {
    const handle = uuidv4();

    let res: MultiSimulationResult;
    switch (simulationMode) {
      case 'monteCarloStochasticReturns': {
        const engine = new MonteCarloSimulationEngine(inputs, baseSeed);
        res = engine.runMonteCarloSimulation(numSimulations);
        break;
      }
      case 'monteCarloHistoricalReturns': {
        const engine = new LcgHistoricalBacktestSimulationEngine(inputs, baseSeed);
        res = engine.runLcgHistoricalBacktest(numSimulations);
        break;
      }
    }

    cache = { handle, res };
    return { handle };
  },

  async getDerivedMultiSimulationData(
    handle: string,
    sortMode: 'retirementAge' | 'finalPortfolioValue' | 'bankruptcyAge' | 'averageStockReturn'
  ): Promise<{ analysis: MultiSimulationAnalysis; tableData: MultiSimulationTableRow[]; yearlyTableData: YearlyAggregateTableRow[] }> {
    if (!cache || cache.handle !== handle) throw new Error('Simulation not found');
    const { res } = cache;

    const analyzer = new MultiSimulationAnalyzer();
    const analysis = analyzer.analyzeV2(res, sortMode);

    const extractor = new TableDataExtractor();
    const tableData = extractor.extractMultiSimulationData(res, SimulationCategory.Portfolio);
    const yearlyTableData = extractor.extractMultiSimulationYearlyAggregateData(res, analysis, SimulationCategory.Portfolio);

    return { analysis, tableData, yearlyTableData };
  },

  async clear(): Promise<void> {
    cache = null;
  },
};

Comlink.expose(simulationAPI);

export type SimulationWorkerAPI = typeof simulationAPI;
