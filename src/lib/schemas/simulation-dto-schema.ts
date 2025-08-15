/**
 * Simulation DTO Schema - Data Transfer Object Validation
 *
 * This module provides comprehensive Zod schema definitions for simulation data transfer objects
 * used in web worker communication. It validates simulation results, portfolio data, and
 * multi-simulation aggregates to ensure type safety across worker boundaries.
 *
 * Architecture:
 * - Zod schemas for runtime validation of simulation DTOs
 * - Type-safe data transfer between main thread and workers
 * - Comprehensive validation for complex nested simulation data
 * - Helper functions for parsing and validation
 *
 * Key Features:
 * - Portfolio DTO validation with asset composition
 * - Simulation result validation with metadata arrays
 * - Multi-simulation result validation for Monte Carlo and historical backtests
 * - Historical range info validation for backtest simulations
 * - Runtime type checking for worker communication safety
 */

import { z } from 'zod';
import type { PhaseType as SourcePhaseType } from '@/lib/calc/simulation-phase';
import type { ReturnsWithMetadata as SourceReturnsWithMetadata } from '@/lib/calc/returns-provider';
import type { WithdrawalsWithMetadata as SourceWithdrawalsWithMetadata } from '@/lib/calc/withdrawal-strategy';
import type { Asset as SourceAsset, AssetClass as SourceAssetClass } from '@/lib/calc/asset';
import type { HistoricalRangeInfo as SourceHistoricalRangeInfo } from '@/lib/calc/simulation-engine';
import type { Portfolio } from '@/lib/calc/portfolio';
import type { CashFlowsWithMetadata } from '@/lib/calc/cash-flow';

// ================================
// CORE TYPE SCHEMAS
// ================================

/**
 * Asset class schema - validates the three supported asset types
 * Ensures consistency with source AssetClass type
 */
export const assetClassSchema = z.enum(['stocks', 'bonds', 'cash']) satisfies z.ZodType<SourceAssetClass>;

/**
 * Phase type schema - validates simulation phases
 * Ensures consistency with source PhaseType
 */
export const phaseTypeSchema = z.enum(['retirement', 'accumulation']) satisfies z.ZodType<SourcePhaseType>;

/**
 * Asset schema - validates individual portfolio holdings
 * Ensures consistency with source Asset interface
 */
export const assetSchema = z.object({
  assetClass: assetClassSchema,
  value: z.number(),
}) satisfies z.ZodType<SourceAsset>;

/**
 * Portfolio DTO schema - validates portfolio data for transfer
 * Ensures structural compatibility with Portfolio class
 */
export const portfolioDTOSchema = z.object({
  assets: z.array(assetSchema),
  contributions: z.number(),
  withdrawals: z.number(),
}) satisfies z.ZodType<Pick<Portfolio, 'assets' | 'contributions' | 'withdrawals'>>;

// ================================
// METADATA SCHEMAS
// ================================

/**
 * Returns with metadata schema - validates asset return data with context
 * Ensures consistency with source ReturnsWithMetadata interface
 */
export const returnsWithMetadataSchema = z.object({
  returns: z.record(assetClassSchema, z.number()),
  amounts: z.record(assetClassSchema, z.number()).optional(),
  metadata: z.object({
    inflationRate: z.number(),
    extras: z.record(z.string(), z.unknown()).optional(),
  }),
}) satisfies z.ZodType<SourceReturnsWithMetadata>;

/**
 * Withdrawals with metadata schema - validates withdrawal data
 * Ensures consistency with source WithdrawalsWithMetadata interface
 */
export const withdrawalsWithMetadataSchema = z.object({
  withdrawalAmount: z.number(),
  withdrawalPercentage: z.number(),
}) satisfies z.ZodType<SourceWithdrawalsWithMetadata>;

/**
 * Cash flows with metadata schema - validates arrays of cash flow entries
 * Ensures consistency with CashFlowsWithMetadata type
 */
export const cashFlowsWithMetadataSchema = z.array(
  z.object({
    name: z.string(),
    amount: z.number(),
  })
) satisfies z.ZodType<CashFlowsWithMetadata>;

/**
 * Historical range info schema - validates historical backtest range data
 * Ensures consistency with source HistoricalRangeInfo interface
 */
export const historicalRangeInfoSchema = z.object({
  historicalRanges: z.array(
    z.object({
      startYear: z.number(),
      endYear: z.number(),
    })
  ),
}) satisfies z.ZodType<SourceHistoricalRangeInfo>;

// ================================
// SIMULATION RESULT SCHEMAS
// ================================

/**
 * Simulation result DTO schema - validates complete simulation results
 */
export const simulationResultDTOSchema = z.object({
  success: z.boolean(),
  bankruptcyAge: z.number().nullable(),
  data: z.array(z.tuple([z.number(), portfolioDTOSchema])),
  phasesMetadata: z.array(z.tuple([z.number(), phaseTypeSchema])),
  returnsMetadata: z.array(z.tuple([z.number(), returnsWithMetadataSchema])),
  cashFlowsMetadata: z.array(z.tuple([z.number(), cashFlowsWithMetadataSchema])),
  withdrawalsMetadata: z.array(z.tuple([z.number(), withdrawalsWithMetadataSchema])),
});

/**
 * Simulation result with historical info schema - for backtest simulations
 */
export const simulationResultWithHistoricalSchema = simulationResultDTOSchema.and(historicalRangeInfoSchema);

/**
 * Multi-simulation result DTO schema - validates collections of simulation results
 */
export const multiSimulationResultDTOSchema = z.object({
  simulations: z.array(
    z.tuple([
      z.number(), // seed
      z.union([simulationResultDTOSchema, simulationResultWithHistoricalSchema]),
    ])
  ),
});

// ================================
// PUBLIC EXPORTS
// ================================

/**
 * Main type for multi-simulation results
 * This is the primary interface for worker communication
 */
export type MultiSimulationResultDTO = z.infer<typeof multiSimulationResultDTOSchema>;
