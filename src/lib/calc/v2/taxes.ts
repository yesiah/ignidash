import { SimulationState } from './simulation-engine';

import { IncomesData } from './incomes';
import { PortfolioData } from './portfolio';

export interface TaxesData {
  incomeTaxRate: number;
  incomeTaxAmount: number;
  netIncome: number;
}

export class TaxProcessor {
  constructor(private simulationState: SimulationState) {}

  process(annualPortfolioData: PortfolioData, annualIncomesData: IncomesData): TaxesData {
    const incomeTaxRate = 0.3;
    const incomeTaxAmount = annualIncomesData.totalGrossIncome * incomeTaxRate;
    const netIncome = annualIncomesData.totalGrossIncome - incomeTaxAmount;
    return { incomeTaxRate, incomeTaxAmount, netIncome };
  }
}
