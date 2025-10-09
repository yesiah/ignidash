export type AssetClass = 'stocks' | 'bonds' | 'cash';
export type TaxCategory = 'taxable' | 'taxDeferred' | 'taxFree';

export type AssetReturnRates = Record<AssetClass, number>;
export type AssetReturnAmounts = Record<AssetClass, number>;

export type AssetYieldRates = Record<AssetClass, number>;
export type AssetYieldAmounts = Record<TaxCategory, Record<AssetClass, number>>;

export type AssetAllocation = Record<AssetClass, number>;
