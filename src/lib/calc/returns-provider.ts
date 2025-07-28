/**
 * Returns Provider - Asset Return Rate Calculation System
 *
 * This module provides a flexible system for calculating asset return rates used in financial
 * projections. It implements a provider pattern that allows for different return calculation
 * strategies while maintaining consistent interfaces for portfolio analysis.
 *
 * Architecture:
 * - ReturnsProvider interface for pluggable return calculation strategies
 * - Real return calculations using the Fisher equation for inflation adjustment
 * - Year-based return queries supporting time-dependent scenarios
 * - Separation of nominal market assumptions from real calculation results
 *
 * Key Features:
 * - Inflation-adjusted real return calculations
 * - Consistent return interface across asset classes (stocks, bonds, cash)
 * - Extensible provider pattern for future return models
 * - Integration with market assumptions from user inputs
 * - Fisher equation implementation for accurate real return conversion
 */

import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { AssetReturns } from './asset';

/**
 * Represents asset returns data combined with relevant metadata.
 * This interface is used to encapsulate the returns along with any additional
 * information that may be needed for tracking or display purposes.
 */
export interface ReturnsWithMetadata {
  returns: AssetReturns;
  metadata: {
    inflationRate: number;
    /** Optional extras that providers can add for simulation-specific data */
    extras?: Record<string, unknown>;
  };
}

/**
 * Returns provider interface for asset return calculations
 * Defines the contract for all return calculation strategies
 */
export interface ReturnsProvider {
  /**
   * Get the real returns for a specific year.
   * @param year The year for which to get the returns.
   * @returns The real asset returns for the specified year.
   */
  getReturns(year: number): ReturnsWithMetadata;
}

/**
 * Fixed Return Provider Implementation
 * Provides consistent real returns based on user's market assumptions
 * Converts nominal returns to real returns using the Fisher equation
 */
export class FixedReturnProvider implements ReturnsProvider {
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
