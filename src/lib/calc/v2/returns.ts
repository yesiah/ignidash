import type { SimulationState } from './simulation-engine';
import { ReturnsProvider } from '../returns-provider';
import type { AssetReturnRates, AssetReturnAmounts } from '../asset';

export interface ReturnsData {
  returnAmounts: AssetReturnAmounts;
  returnRates: AssetReturnRates;
  inflationRate: number;
}

export class ReturnsProcessor {
  constructor(
    private simulationState: SimulationState,
    private returnsProvider: ReturnsProvider
  ) {}

  process(): ReturnsData {
    const returns = this.returnsProvider.getReturns(this.simulationState.time.year);

    const {
      returns: returnRates,
      metadata: { inflationRate },
    } = returns;

    const returnAmounts = this.simulationState.portfolio.applyReturns(returnRates);

    return { returnAmounts, returnRates, inflationRate };
  }
}
