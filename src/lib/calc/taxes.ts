import type { AccountInputs } from '@/lib/schemas/inputs/account-form-schema';
import type { FilingStatus } from '@/lib/schemas/inputs/tax-settings-schema';

import type { SimulationState } from './simulation-engine';
import type { IncomesData } from './incomes';
import type { PortfolioData } from './portfolio';
import type { ReturnsData } from './returns';

export interface CapitalGainsTaxesData {
  taxableCapitalGains: number;
  capitalGainsTaxAmount: number;
  effectiveCapitalGainsTaxRate: number;
  topMarginalCapitalGainsTaxRate: number;
}

export interface IncomeTaxesData {
  taxableOrdinaryIncome: number;
  incomeTaxAmount: number;
  effectiveIncomeTaxRate: number;
  topMarginalIncomeTaxRate: number;
  capitalLossDeduction?: number;
}

export interface TaxesData {
  adjustedGrossIncome: number;
  incomeTaxes: IncomeTaxesData;
  capitalGainsTaxes: CapitalGainsTaxesData;
  earlyWithdrawalPenalties: EarlyWithdrawalPenaltyData;
  totalTaxesDue: number;
  totalTaxesRefund: number;
  totalTaxableIncome: number;
  adjustments: Record<string, number>;
  deductions: Record<string, number>;
}

export interface EarlyWithdrawalPenaltyData {
  taxDeferredPenaltyAmount: number;
  taxFreePenaltyAmount: number;
  totalPenaltyAmount: number;
}

// Standard Deductions (2025 tax year)
const STANDARD_DEDUCTION_SINGLE = 15000;
const STANDARD_DEDUCTION_MARRIED_FILING_JOINTLY = 30000;
const STANDARD_DEDUCTION_HEAD_OF_HOUSEHOLD = 22500;

// Income Tax Brackets (2025 tax year)
export const INCOME_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 11925, rate: 0.1 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

export const INCOME_TAX_BRACKETS_MARRIED_FILING_JOINTLY = [
  { min: 0, max: 23850, rate: 0.1 },
  { min: 23850, max: 96950, rate: 0.12 },
  { min: 96950, max: 206700, rate: 0.22 },
  { min: 206700, max: 394600, rate: 0.24 },
  { min: 394600, max: 501050, rate: 0.32 },
  { min: 501050, max: 751600, rate: 0.35 },
  { min: 751600, max: Infinity, rate: 0.37 },
];

export const INCOME_TAX_BRACKETS_HEAD_OF_HOUSEHOLD = [
  { min: 0, max: 16550, rate: 0.1 },
  { min: 16550, max: 63100, rate: 0.12 },
  { min: 63100, max: 100500, rate: 0.22 },
  { min: 100500, max: 191950, rate: 0.24 },
  { min: 191950, max: 243700, rate: 0.32 },
  { min: 243700, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

// Capital Gains Tax Brackets (2024 tax year - based on IRS data provided)
export const CAPITAL_GAINS_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 47025, rate: 0.0 },
  { min: 47025, max: 518900, rate: 0.15 },
  { min: 518900, max: Infinity, rate: 0.2 },
];

export const CAPITAL_GAINS_TAX_BRACKETS_MARRIED_FILING_JOINTLY = [
  { min: 0, max: 94050, rate: 0.0 },
  { min: 94050, max: 583750, rate: 0.15 },
  { min: 583750, max: Infinity, rate: 0.2 },
];

export const CAPITAL_GAINS_TAX_BRACKETS_HEAD_OF_HOUSEHOLD = [
  { min: 0, max: 63000, rate: 0.0 },
  { min: 63000, max: 551350, rate: 0.15 },
  { min: 551350, max: Infinity, rate: 0.2 },
];

export class TaxProcessor {
  private capitalLossCarryover = 0;

  constructor(
    private simulationState: SimulationState,
    private filingStatus: FilingStatus
  ) {}

  process(annualPortfolioDataBeforeTaxes: PortfolioData, annualIncomesData: IncomesData, annualReturnsData: ReturnsData): TaxesData {
    const { totalIncome, adjustedOrdinaryIncome, taxDeferredContributions } = this.getIncomeData(
      annualPortfolioDataBeforeTaxes,
      annualIncomesData,
      annualReturnsData
    );
    const { adjustedRealizedGains, capitalLossDeduction } = this.getRealizedGainsAndCapLossDeductionData(annualPortfolioDataBeforeTaxes);

    const adjustedIncomeTaxedAsIncome = Math.max(0, adjustedOrdinaryIncome + capitalLossDeduction);
    const adjustedIncomeTaxedAsCapGains = adjustedRealizedGains + annualReturnsData.yieldAmountsForPeriod.taxable.stocks;

    const standardDeduction = this.getStandardDeduction();
    const deductionUsedForOrdinary = Math.min(standardDeduction, adjustedIncomeTaxedAsIncome);
    const deductionUsedForGains = standardDeduction - deductionUsedForOrdinary;

    const taxableOrdinaryIncome = Math.max(0, adjustedIncomeTaxedAsIncome - deductionUsedForOrdinary);
    const taxableCapitalGains = Math.max(0, adjustedIncomeTaxedAsCapGains - deductionUsedForGains);

    const { incomeTaxAmount, topMarginalIncomeTaxRate } = this.processIncomeTaxes(taxableOrdinaryIncome);
    const incomeTaxes: IncomeTaxesData = {
      taxableOrdinaryIncome,
      incomeTaxAmount,
      effectiveIncomeTaxRate: totalIncome > 0 ? incomeTaxAmount / totalIncome : 0,
      topMarginalIncomeTaxRate,
      capitalLossDeduction: capitalLossDeduction !== 0 ? capitalLossDeduction : undefined,
    };

    const { capitalGainsTaxAmount, topMarginalCapitalGainsTaxRate } = this.processCapitalGainsTaxes(
      taxableCapitalGains,
      taxableOrdinaryIncome
    );
    const capitalGainsTaxes: CapitalGainsTaxesData = {
      taxableCapitalGains,
      capitalGainsTaxAmount,
      effectiveCapitalGainsTaxRate: adjustedIncomeTaxedAsCapGains > 0 ? capitalGainsTaxAmount / adjustedIncomeTaxedAsCapGains : 0,
      topMarginalCapitalGainsTaxRate,
    };

    const earlyWithdrawalPenalties = this.processEarlyWithdrawalPenalties(annualPortfolioDataBeforeTaxes);

    const totalTaxLiabilityExcludingFICA =
      incomeTaxes.incomeTaxAmount + capitalGainsTaxes.capitalGainsTaxAmount + earlyWithdrawalPenalties.totalPenaltyAmount;
    const difference = totalTaxLiabilityExcludingFICA - annualIncomesData.totalAmountWithheld;

    return {
      adjustedGrossIncome: adjustedIncomeTaxedAsIncome + adjustedIncomeTaxedAsCapGains,
      incomeTaxes,
      capitalGainsTaxes,
      earlyWithdrawalPenalties,
      totalTaxesDue: difference > 0 ? difference : 0,
      totalTaxesRefund: difference < 0 ? Math.abs(difference) : 0,
      totalTaxableIncome: taxableOrdinaryIncome + taxableCapitalGains,
      adjustments: { taxDeferredContributions, capitalLossDeduction },
      deductions: { standardDeduction },
    };
  }

  private processIncomeTaxes(taxableOrdinaryIncome: number): { incomeTaxAmount: number; topMarginalIncomeTaxRate: number } {
    let incomeTaxAmount = 0;
    let topMarginalIncomeTaxRate = 0;

    const incomeTaxBrackets = this.getIncomeTaxBrackets();
    for (const bracket of incomeTaxBrackets) {
      if (taxableOrdinaryIncome <= bracket.min) break;

      const taxableInBracket = Math.min(taxableOrdinaryIncome, bracket.max) - bracket.min;
      incomeTaxAmount += taxableInBracket * bracket.rate;
      topMarginalIncomeTaxRate = bracket.rate;
    }

    return { incomeTaxAmount, topMarginalIncomeTaxRate };
  }

  private processCapitalGainsTaxes(
    taxableCapitalGains: number,
    taxableOrdinaryIncome: number
  ): { capitalGainsTaxAmount: number; topMarginalCapitalGainsTaxRate: number } {
    const totalTaxableIncome = taxableOrdinaryIncome + taxableCapitalGains;

    let capitalGainsTaxAmount = 0;
    let topMarginalCapitalGainsTaxRate = 0;

    const capitalGainsTaxBrackets = this.getCapitalGainsTaxBrackets();
    for (const bracket of capitalGainsTaxBrackets) {
      if (totalTaxableIncome <= bracket.min) break;

      const incomeInBracket = Math.min(totalTaxableIncome, bracket.max) - bracket.min;
      const ordinaryIncomeInBracket = Math.max(0, Math.min(taxableOrdinaryIncome, bracket.max) - bracket.min);
      const capitalGainsInBracket = incomeInBracket - ordinaryIncomeInBracket;

      capitalGainsTaxAmount += capitalGainsInBracket * bracket.rate;
      topMarginalCapitalGainsTaxRate = bracket.rate;
    }

    return { capitalGainsTaxAmount, topMarginalCapitalGainsTaxRate };
  }

  private processEarlyWithdrawalPenalties(annualPortfolioDataBeforeTaxes: PortfolioData): EarlyWithdrawalPenaltyData {
    let taxDeferredPenaltyAmount = 0;
    let taxFreePenaltyAmount = 0;

    const age = this.simulationState.time.age;
    const regularQualifiedWithdrawalAge = 59.5;

    if (age < regularQualifiedWithdrawalAge) {
      const taxDeferredWithdrawalsFrom401kAndIra = this.getWithdrawalsForAccountTypes(annualPortfolioDataBeforeTaxes, ['401k', 'ira']);
      taxDeferredPenaltyAmount += taxDeferredWithdrawalsFrom401kAndIra * 0.1;

      const earningsWithdrawnFromRoth = this.getEarningsWithdrawnFromRothAccountTypes(annualPortfolioDataBeforeTaxes);
      taxFreePenaltyAmount += earningsWithdrawnFromRoth * 0.1;
    }

    const hsaQualifiedWithdrawalAge = 65;
    if (age < hsaQualifiedWithdrawalAge) {
      const taxDeferredWithdrawalsFromHsa = this.getWithdrawalsForAccountTypes(annualPortfolioDataBeforeTaxes, ['hsa']);
      taxDeferredPenaltyAmount += taxDeferredWithdrawalsFromHsa * 0.2;
    }

    return { taxDeferredPenaltyAmount, taxFreePenaltyAmount, totalPenaltyAmount: taxDeferredPenaltyAmount + taxFreePenaltyAmount };
  }

  private getIncomeData(
    annualPortfolioDataBeforeTaxes: PortfolioData,
    annualIncomesData: IncomesData,
    annualReturnsData: ReturnsData
  ): { totalIncome: number; grossOrdinaryIncome: number; adjustedOrdinaryIncome: number; taxDeferredContributions: number } {
    const grossIncomeFromIncomes = annualIncomesData.totalIncome;
    const grossIncomeFromInterest =
      annualReturnsData.yieldAmountsForPeriod.taxable.bonds + annualReturnsData.yieldAmountsForPeriod.cashSavings.cash;

    const age = this.simulationState.time.age;
    const rothEarningsQualifiedWithdrawalAge = 59.5;

    let grossIncomeFromTaxDeferredWithdrawals = this.getWithdrawalsForAccountTypes(annualPortfolioDataBeforeTaxes, ['401k', 'ira', 'hsa']);
    if (age < rothEarningsQualifiedWithdrawalAge) {
      grossIncomeFromTaxDeferredWithdrawals += this.getEarningsWithdrawnFromRothAccountTypes(annualPortfolioDataBeforeTaxes);
    }

    const taxDeferredContributions = this.getEmployeeContributionsForAccountTypes(annualPortfolioDataBeforeTaxes, ['401k', 'ira', 'hsa']);
    const taxExemptIncome = annualIncomesData.totalTaxExemptIncome;

    const totalIncome = grossIncomeFromIncomes + grossIncomeFromInterest + grossIncomeFromTaxDeferredWithdrawals;
    const grossOrdinaryIncome = Math.max(0, totalIncome - taxExemptIncome);
    const adjustedOrdinaryIncome = Math.max(0, grossOrdinaryIncome - taxDeferredContributions);

    return {
      totalIncome,
      grossOrdinaryIncome,
      adjustedOrdinaryIncome,
      taxDeferredContributions,
    };
  }

  private getRealizedGainsAndCapLossDeductionData(annualPortfolioDataBeforeTaxes: PortfolioData): {
    adjustedRealizedGains: number;
    capitalLossDeduction: number;
  } {
    const adjustedRealizedGains = annualPortfolioDataBeforeTaxes.realizedGainsForPeriod + this.capitalLossCarryover;
    if (adjustedRealizedGains >= 0) {
      this.capitalLossCarryover = 0;
      return { adjustedRealizedGains, capitalLossDeduction: 0 };
    }

    const capitalLossDeduction = Math.max(-3000, adjustedRealizedGains);
    this.capitalLossCarryover = adjustedRealizedGains - capitalLossDeduction;
    return { adjustedRealizedGains: 0, capitalLossDeduction };
  }

  private getEmployeeContributionsForAccountTypes(
    annualPortfolioDataBeforeTaxes: PortfolioData,
    accountTypes: AccountInputs['type'][]
  ): number {
    return Object.values(annualPortfolioDataBeforeTaxes.perAccountData)
      .filter((account) => accountTypes.includes(account.type))
      .reduce((sum, account) => sum + (account.contributionsForPeriod - account.employerMatchForPeriod), 0);
  }

  private getWithdrawalsForAccountTypes(annualPortfolioDataBeforeTaxes: PortfolioData, accountTypes: AccountInputs['type'][]): number {
    return Object.values(annualPortfolioDataBeforeTaxes.perAccountData)
      .filter((account) => accountTypes.includes(account.type))
      .reduce((sum, account) => sum + account.withdrawalsForPeriod, 0);
  }

  private getEarningsWithdrawnFromRothAccountTypes(annualPortfolioDataBeforeTaxes: PortfolioData): number {
    const rothAccountTypes = ['roth401k', 'rothIra'] as AccountInputs['type'][];

    return Object.values(annualPortfolioDataBeforeTaxes.perAccountData)
      .filter((account) => rothAccountTypes.includes(account.type))
      .reduce((sum, account) => sum + account.earningsWithdrawnForPeriod, 0);
  }

  private getStandardDeduction(): number {
    switch (this.filingStatus) {
      case 'single':
        return STANDARD_DEDUCTION_SINGLE;
      case 'marriedFilingJointly':
        return STANDARD_DEDUCTION_MARRIED_FILING_JOINTLY;
      case 'headOfHousehold':
        return STANDARD_DEDUCTION_HEAD_OF_HOUSEHOLD;
    }
  }

  private getIncomeTaxBrackets(): { min: number; max: number; rate: number }[] {
    switch (this.filingStatus) {
      case 'single':
        return INCOME_TAX_BRACKETS_SINGLE;
      case 'marriedFilingJointly':
        return INCOME_TAX_BRACKETS_MARRIED_FILING_JOINTLY;
      case 'headOfHousehold':
        return INCOME_TAX_BRACKETS_HEAD_OF_HOUSEHOLD;
    }
  }

  private getCapitalGainsTaxBrackets(): { min: number; max: number; rate: number }[] {
    switch (this.filingStatus) {
      case 'single':
        return CAPITAL_GAINS_TAX_BRACKETS_SINGLE;
      case 'marriedFilingJointly':
        return CAPITAL_GAINS_TAX_BRACKETS_MARRIED_FILING_JOINTLY;
      case 'headOfHousehold':
        return CAPITAL_GAINS_TAX_BRACKETS_HEAD_OF_HOUSEHOLD;
    }
  }
}
