export type AssetClass = 'stocks' | 'bonds' | 'cash';
export type TaxCategory = 'taxable' | 'taxDeferred' | 'taxFree' | 'cashSavings';

export type AssetReturnRates = Record<AssetClass, number>;
export type AssetReturnAmounts = Record<AssetClass, number>;

export const sumReturnAmounts = (r: AssetReturnAmounts): number => r.stocks + r.bonds + r.cash;

export type AssetYieldRates = Record<AssetClass, number>;
export type AssetYieldAmounts = Record<AssetClass, number>;

export const sumYieldAmounts = (y: AssetYieldAmounts): number => y.stocks + y.bonds + y.cash;

export type AssetAllocation = Record<AssetClass, number>;
export type AssetValues = Record<AssetClass, number>;
export type AssetFlows = Record<AssetClass, number>;

export const sumFlows = (t: AssetFlows): number => t.stocks + t.bonds + t.cash;

export const sumInvestments = (t: AssetFlows): number => t.stocks + t.bonds;
export const sumLiquidations = (t: AssetFlows): number => t.stocks + t.bonds;
