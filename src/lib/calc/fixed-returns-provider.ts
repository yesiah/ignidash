import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';
import { ReturnsProvider, ReturnsWithMetadata } from './returns-provider';

/**
 * Fixed Return Provider Implementation
 * Provides consistent real returns based on user's market assumptions
 * Converts nominal returns to real returns using the Fisher equation
 */
export class FixedReturnsProvider implements ReturnsProvider {
  /**
   * Creates a fixed return provider with user's market assumptions
   * @param inputs - User's financial planning inputs containing market assumptions
   */
  constructor(private inputs: QuickPlanInputs) {}

  /**
   * Calculates real asset returns using Fisher equation for inflation adjustment
   * Formula: real_return = (1 + nominal_return) / (1 + inflation_rate) - 1
   * @param _year - Year parameter (unused in fixed return implementation)
   * @returns Real asset returns as decimal rates for each asset class
   */
  getReturns(_year: number): ReturnsWithMetadata {
    const { stockReturn, bondReturn, cashReturn, inflationRate } = this.inputs.marketAssumptions;

    const realStockReturn = (1 + stockReturn / 100) / (1 + inflationRate / 100) - 1;
    const realBondReturn = (1 + bondReturn / 100) / (1 + inflationRate / 100) - 1;
    const realCashReturn = (1 + cashReturn / 100) / (1 + inflationRate / 100) - 1;

    return {
      returns: {
        stocks: realStockReturn,
        bonds: realBondReturn,
        cash: realCashReturn,
      },
      metadata: {
        inflationRate,
      },
    };
  }
}
