import type { SimulationDataPoint } from '@/lib/calc/v2/simulation-engine';

export interface MilestonesData {
  yearsToRetirement: number | null;
  retirementAge: number | null;
  yearsToBankruptcy: number | null;
  bankruptcyAge: number | null;
}

export interface ReturnsStatsData {
  averageStockReturn: number | null;
  averageBondReturn: number | null;
  averageCashReturn: number | null;
  averageInflationRate: number | null;
  minStockReturn: number;
  maxStockReturn: number;
}

export class SimulationDataExtractor {
  static getMilestonesData(data: SimulationDataPoint[], startAge: number): MilestonesData {
    let yearsToRetirement: number | null = null;
    let retirementAge: number | null = null;
    let yearsToBankruptcy: number | null = null;
    let bankruptcyAge: number | null = null;

    for (const dp of data) {
      const phase = dp.phase;
      if (phase?.name === 'retirement' && retirementAge === null) {
        const retirementDate = new Date(dp.date);

        yearsToRetirement = retirementDate.getFullYear() - new Date().getFullYear();
        retirementAge = startAge + yearsToRetirement;
      }

      if (dp.portfolio.totalValue <= 0.1 && bankruptcyAge === null) {
        const bankruptcyDate = new Date(dp.date);

        yearsToBankruptcy = bankruptcyDate.getFullYear() - new Date().getFullYear();
        bankruptcyAge = startAge + yearsToBankruptcy;
      }
    }

    return { yearsToRetirement, retirementAge, yearsToBankruptcy, bankruptcyAge };
  }

  static getAverageReturns(data: SimulationDataPoint[]): ReturnsStatsData {
    const { stocks, bonds, cash, inflation, count, minStockReturn, maxStockReturn } = data.slice(1).reduce(
      (acc, dp) => {
        const returnsData = dp.returns!;
        const stockReturn = returnsData.annualReturnRates.stocks;

        return {
          stocks: acc.stocks + stockReturn,
          bonds: acc.bonds + returnsData.annualReturnRates.bonds,
          cash: acc.cash + returnsData.annualReturnRates.cash,
          inflation: acc.inflation + returnsData.annualInflationRate,
          count: acc.count + 1,
          minStockReturn: Math.min(acc.minStockReturn, stockReturn),
          maxStockReturn: Math.max(acc.maxStockReturn, stockReturn),
        };
      },
      { stocks: 0, bonds: 0, cash: 0, inflation: 0, count: 0, minStockReturn: Infinity, maxStockReturn: -Infinity }
    );

    const averageStockReturn = count > 0 ? stocks / count : null;
    const averageBondReturn = count > 0 ? bonds / count : null;
    const averageCashReturn = count > 0 ? cash / count : null;
    const averageInflationRate = count > 0 ? inflation / count : null;

    return { averageStockReturn, averageBondReturn, averageCashReturn, averageInflationRate, minStockReturn, maxStockReturn };
  }
}
