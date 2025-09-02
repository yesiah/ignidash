import { SimulationState } from './simulation-engine';
import { ReturnsProvider } from '../returns-provider';
import type { AssetReturnRates, AssetReturnAmounts } from '../asset';

export interface ReturnsData {
  returnAmounts: AssetReturnAmounts;
  returnRates: AssetReturnRates;
  inflationRate: number;
}

export class ReturnsProcessor {
  private returnRates: AssetReturnRates | null = null;
  private inflationRate: number | null = null;

  constructor(
    private simulationState: SimulationState,
    private returnsProvider: ReturnsProvider
  ) {}

  process(): ReturnsData {
    const returns = this.returnsProvider.getReturns(this.simulationState.year);

    this.returnRates = returns.returns;
    this.inflationRate = returns.metadata.inflationRate;

    return {
      returnAmounts: this.simulationState.portfolio.applyReturns(this.returnRates!),
      returnRates: this.returnRates!,
      inflationRate: this.inflationRate!,
    };
  }
}
