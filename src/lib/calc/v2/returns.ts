import { SimulationState } from './simulation-engine';
import { ReturnsProvider } from '../returns-provider';
import type { AssetReturnRates } from '../asset';

export class ReturnsProcessor {
  private returns: AssetReturnRates | null = null;
  private lastSimulationYear: number | null = null;

  constructor(
    private simulationState: SimulationState,
    private returnsProvider: ReturnsProvider
  ) {}

  process(): void {
    const simulationYear = Math.floor(this.simulationState.year);

    if (this.lastSimulationYear !== simulationYear) {
      this.returns = this.returnsProvider.getReturns(simulationYear).returns;
      this.lastSimulationYear = simulationYear;
    }

    switch (this.simulationState.interval) {
      case 'month':
        const monthlyReturns: AssetReturnRates = {
          stocks: Math.pow(1 + this.returns!.stocks, 1 / 12) - 1,
          bonds: Math.pow(1 + this.returns!.bonds, 1 / 12) - 1,
          cash: Math.pow(1 + this.returns!.cash, 1 / 12) - 1,
        };
        this.simulationState.portfolio.applyReturns(monthlyReturns);
        break;
      case 'year':
        this.simulationState.portfolio.applyReturns(this.returns!);
        break;
    }

    return;
  }
}
