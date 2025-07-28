/**
 * Historical Backtest Returns Provider - Real Historical Return Data System
 *
 * This module implements historical backtesting using NYU Stern historical financial market data.
 * It provides returns based on actual historical sequences starting from any year between 1928-2024,
 * allowing financial plans to be tested against real market conditions.
 *
 * Architecture:
 * - Uses real historical returns from NYU dataset (1928-2024)
 * - Supports any starting year with automatic looping when reaching end of data
 * - Maintains year-by-year progression through historical sequence
 * - Converts historical data format to standard AssetReturns interface
 *
 * Key Features:
 * - Real historical market data validation
 * - Automatic data cycling for long simulations
 * - Consistent interface with other returns providers
 * - Year-aware progression through historical timeline
 */

import { ReturnsProvider, ReturnsWithMetadata } from './returns-provider';
import { nyuHistoricalData, NyuHistoricalYearData, getNyuDataRange } from './data/nyu-historical-data';
import { AssetReturns } from './asset';

/**
 * Historical Backtest Returns Provider Implementation
 * Provides returns based on real historical data starting from a specified year
 * Automatically loops back to beginning of data when simulation extends beyond available years
 */
export class HistoricalBacktestReturnsProvider implements ReturnsProvider {
  private dataRange: { startYear: number; endYear: number };
  private historicalData: NyuHistoricalYearData[];

  /**
   * Creates a historical backtest returns provider
   * @param startYear - The historical year to begin the sequence (1928-2024)
   */
  constructor(private startYear: number) {
    this.dataRange = getNyuDataRange();
    this.historicalData = nyuHistoricalData;

    // Validate start year is within available data range
    if (startYear < this.dataRange.startYear || startYear > this.dataRange.endYear) {
      throw new Error(`Start year ${startYear} is outside available data range (${this.dataRange.startYear}-${this.dataRange.endYear})`);
    }
  }

  /**
   * Get historical returns for a specific simulation year
   * @param simulationYear - The year within the simulation (1-based, e.g., year 1 = first year of simulation)
   * @returns Real asset returns with inflation metadata from historical data
   */
  getReturns(simulationYear: number): ReturnsWithMetadata {
    // Calculate which historical year to use
    // simulationYear 1 maps to startYear, simulationYear 2 maps to startYear + 1, etc.
    const targetHistoricalYear = this.startYear + simulationYear - 1;

    // Handle looping when we exceed available data
    const totalYearsAvailable = this.dataRange.endYear - this.dataRange.startYear + 1;
    const adjustedYear = this.dataRange.startYear + ((targetHistoricalYear - this.dataRange.startYear) % totalYearsAvailable);

    // Find the historical data for this year
    const yearData = this.historicalData.find((data) => data.year === adjustedYear);

    if (!yearData) {
      throw new Error(`Historical data not found for year ${adjustedYear}`);
    }

    // Convert NYU historical data format to AssetReturns format
    const returns: AssetReturns = {
      stocks: yearData.stockReturn,
      bonds: yearData.bondReturn,
      cash: yearData.cashReturn,
    };

    return {
      returns,
      metadata: {
        inflationRate: yearData.inflationRate * 100, // Convert to percentage for metadata
        extras: {
          historicalYear: adjustedYear,
          originalStartYear: this.startYear,
          simulationYear,
        },
      },
    };
  }
}
