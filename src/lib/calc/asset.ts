import type { AllocationInputs } from '@/lib/schemas/quick-plan-schema';

export type AssetClass = 'stocks' | 'bonds' | 'cash';

export type AssetReturns = Record<AssetClass, number>;
export type AssetAllocation = Record<AssetClass, number>;

/**
 * All monetary values in this interface are in real (inflation-adjusted) dollars
 * relative to the simulation start date.
 */
export interface Asset {
  principal: number; // Original contributions/cost basis (real dollars)
  growth: number; // Capital gains & losses, inflation-adjusted (real dollars)
  assetClass: AssetClass;
}

/**
 * Converts AllocationInputs (from form) to AssetAllocation (for calculations)
 * Transforms percentage values and key names from form format to calculation format
 */
export const convertAllocationInputsToAssetAllocation = (allocationInputs: AllocationInputs): AssetAllocation => {
  return {
    stocks: allocationInputs.stockAllocation / 100,
    bonds: allocationInputs.bondAllocation / 100,
    cash: allocationInputs.cashAllocation / 100,
  };
};
