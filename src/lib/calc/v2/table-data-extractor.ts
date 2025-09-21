import { SimulationCategory } from '@/lib/types/simulation-category';
import { type SingleSimulationTableRow, validateSingleSimulationTableData } from '@/lib/schemas/single-simulation-table-schema';

import type { SimulationResult, MultiSimulationResult } from './simulation-engine';

export class TableDataExtractor {
  extractSingleSimulationData(simulation: SimulationResult, category: SimulationCategory): SingleSimulationTableRow[] {
    return validateSingleSimulationTableData(
      simulation.data.map((data, idx) => {
        const startAge = simulation.context.startAge;
        const startDateYear = new Date().getFullYear();
        const currDateYear = new Date(data.date).getFullYear();

        const phaseName = data.phase?.name ?? null;

        const portfolioData = data.portfolio;
        const portfolioValue = portfolioData.totalValue;

        const assetAllocation = portfolioData.assetAllocation ?? { stocks: 0, bonds: 0, cash: 0 };
        const stocksAllocation = assetAllocation.stocks;
        const bondsAllocation = assetAllocation.bonds;
        const cashAllocation = assetAllocation.cash;

        const returnsData = data.returns;
        const stockReturn = returnsData?.annualReturnRates.stocks ?? null;
        const bondReturn = returnsData?.annualReturnRates.bonds ?? null;
        const cashReturn = returnsData?.annualReturnRates.cash ?? null;
        const inflationRate = returnsData?.annualInflationRate ?? null;

        return {
          year: idx,
          age: currDateYear - startDateYear + startAge,
          phaseName: phaseName,
          portfolioValue,
          stockValue: portfolioValue * stocksAllocation,
          stockReturn,
          bondValue: portfolioValue * bondsAllocation,
          bondReturn,
          cashValue: portfolioValue * cashAllocation,
          cashReturn,
          inflationRate,
        };
      })
    );
  }

  extractMultiSimulationData(simulations: MultiSimulationResult, category: SimulationCategory): SingleSimulationTableRow[][] {
    throw new Error('Multi-simulation data extraction not implemented yet.');
  }
}
