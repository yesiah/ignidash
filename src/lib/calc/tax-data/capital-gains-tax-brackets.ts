/**
 * Federal long-term capital gains tax brackets by filing status
 *
 * Tax year 2026. Source: IRS 2026 inflation adjustments (including OBBBA amendments).
 */

/** Progressive bracket for long-term capital gains taxation */
export type CapitalGainsTaxBracket = { min: number; max: number; rate: number };

export const CAPITAL_GAINS_TAX_BRACKETS_SINGLE: CapitalGainsTaxBracket[] = [
  { min: 0, max: 49450, rate: 0.0 },
  { min: 49450, max: 545500, rate: 0.15 },
  { min: 545500, max: Infinity, rate: 0.2 },
];

export const CAPITAL_GAINS_TAX_BRACKETS_MARRIED_FILING_JOINTLY: CapitalGainsTaxBracket[] = [
  { min: 0, max: 98900, rate: 0.0 },
  { min: 98900, max: 613700, rate: 0.15 },
  { min: 613700, max: Infinity, rate: 0.2 },
];

export const CAPITAL_GAINS_TAX_BRACKETS_HEAD_OF_HOUSEHOLD: CapitalGainsTaxBracket[] = [
  { min: 0, max: 66200, rate: 0.0 },
  { min: 66200, max: 579600, rate: 0.15 },
  { min: 579600, max: Infinity, rate: 0.2 },
];
