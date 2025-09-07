import { SimulationState } from './simulation-engine';

import { IncomesData } from './incomes';
import { PortfolioData } from './portfolio';

export interface CapitalGainsTaxesData {
  capitalGainsTaxRate: number;
  capitalGainsTaxAmount: number;
}

export interface IncomeTaxesData {
  incomeTaxRate: number;
  incomeTaxAmount: number;
  netIncome: number;
}

export interface TaxesData {
  incomeTaxes: IncomeTaxesData;
  capitalGainsTaxes: CapitalGainsTaxesData;
  totalTaxesDue: number;
  totalTaxesRefund: number;
}

const STANDARD_DEDUCTION_SINGLE = 15000;

const INCOME_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 11925, rate: 0.1 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

const CAPITAL_GAINS_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 47025, rate: 0.0 },
  { min: 47025, max: 518900, rate: 0.15 },
  { min: 518900, max: Infinity, rate: 0.2 },
];

export class TaxProcessor {
  constructor(private simulationState: SimulationState) {}

  process(annualPortfolioDataBeforeTaxes: PortfolioData, annualIncomesData: IncomesData): TaxesData {
    const ordinaryIncome = annualIncomesData.totalGrossIncome;
    const capitalGains = annualPortfolioDataBeforeTaxes.realizedGainsForPeriod;

    const totalIncome = ordinaryIncome + capitalGains;
    const totalTaxableIncome = Math.max(0, totalIncome - STANDARD_DEDUCTION_SINGLE);

    const deductionUsedByOrdinaryIncome = Math.min(ordinaryIncome, STANDARD_DEDUCTION_SINGLE);

    const taxableOrdinaryIncome = Math.min(ordinaryIncome - deductionUsedByOrdinaryIncome, totalTaxableIncome);
    const taxableCapitalGains = totalTaxableIncome - taxableOrdinaryIncome;

    const incomeTaxes = this.processIncomeTaxes(ordinaryIncome, taxableOrdinaryIncome);
    const capitalGainsTaxes = this.processCapitalGainsTaxes(taxableCapitalGains, taxableOrdinaryIncome);

    const totalTaxLiability = incomeTaxes.incomeTaxAmount + capitalGainsTaxes.capitalGainsTaxAmount;

    const difference = totalTaxLiability - annualIncomesData.totalAmountWithheld;
    const totalTaxesDue = difference > 0 ? difference : 0;
    const totalTaxesRefund = difference < 0 ? Math.abs(difference) : 0;

    return { incomeTaxes, capitalGainsTaxes, totalTaxesDue, totalTaxesRefund };
  }

  private processCapitalGainsTaxes(taxableCapitalGains: number, taxableOrdinaryIncome: number): CapitalGainsTaxesData {
    let capitalGainsTaxAmount = 0;
    for (const bracket of CAPITAL_GAINS_TAX_BRACKETS_SINGLE) {
      const bracketStart = Math.max(0, bracket.min - taxableOrdinaryIncome);
      const bracketEnd = Math.max(0, Math.min(bracket.max - taxableOrdinaryIncome, taxableCapitalGains));

      if (bracketEnd > bracketStart) {
        const gainsInBracket = bracketEnd - bracketStart;
        capitalGainsTaxAmount += gainsInBracket * bracket.rate;
      }
    }

    const capitalGainsTaxRate = taxableCapitalGains > 0 ? capitalGainsTaxAmount / taxableCapitalGains : 0;

    return { capitalGainsTaxRate, capitalGainsTaxAmount };
  }

  private processIncomeTaxes(ordinaryIncome: number, taxableOrdinaryIncome: number): IncomeTaxesData {
    let incomeTaxAmount = 0;
    for (const bracket of INCOME_TAX_BRACKETS_SINGLE) {
      if (taxableOrdinaryIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableOrdinaryIncome - bracket.min, bracket.max - bracket.min);
        incomeTaxAmount += taxableInBracket * bracket.rate;
      }
    }

    const incomeTaxRate = ordinaryIncome > 0 ? incomeTaxAmount / ordinaryIncome : 0;
    const netIncome = ordinaryIncome - incomeTaxAmount;

    return { incomeTaxRate, incomeTaxAmount, netIncome };
  }
}
