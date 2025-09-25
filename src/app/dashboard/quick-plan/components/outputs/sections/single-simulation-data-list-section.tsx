'use client';

import { useMemo, memo } from 'react';

import type { SimulationDataPoint, SimulationResult } from '@/lib/calc/v2/simulation-engine';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/catalyst/description-list';
import { formatNumber } from '@/lib/utils';
import SectionContainer from '@/components/ui/section-container';
import Card from '@/components/ui/card';
import { SimulationCategory } from '@/lib/types/simulation-category';

interface DataListCardProps {
  dp: SimulationDataPoint;
}

function PortfolioDataListCardV2({ dp }: DataListCardProps) {
  const returnsData = dp.returns;

  const {
    stocks: stockAmount,
    bonds: bondAmount,
    cash: cashAmount,
  } = returnsData?.returnAmountsForPeriod ?? { stocks: 0, bonds: 0, cash: 0 };

  const portfolioData = dp.portfolio;

  const totalWithdrawals = portfolioData.withdrawalsForPeriod;
  const totalContributions = portfolioData.contributionsForPeriod;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Total Return Amount</DescriptionTerm>
        <DescriptionDetails>{formatNumber(stockAmount + bondAmount + cashAmount, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Total Contributions</DescriptionTerm>
        <DescriptionDetails>{formatNumber(totalContributions, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Total Withdrawals</DescriptionTerm>
        <DescriptionDetails>{formatNumber(totalWithdrawals, 2, '$')}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Net Change</DescriptionTerm>
        <DescriptionDetails className="font-bold">
          {formatNumber(stockAmount + bondAmount + cashAmount + totalContributions + totalWithdrawals, 2, '$')}
        </DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

function CashFlowDataListCardV2({ dp }: DataListCardProps) {
  const portfolioData = dp.portfolio;

  let taxDeferredWithdrawals = 0;
  for (const account of Object.values(portfolioData.perAccountData)) {
    switch (account.type) {
      case '401k':
      case 'ira':
      case 'hsa':
        taxDeferredWithdrawals += account.withdrawalsForPeriod;
        break;
      default:
        break;
    }
  }

  const incomesData = dp.incomes;
  const expensesData = dp.expenses;
  const taxesData = dp.taxes;

  const ordinaryIncome = incomesData?.totalGrossIncome ?? 0;
  const grossIncome = ordinaryIncome + taxDeferredWithdrawals;
  const incomeTax = taxesData?.incomeTaxes.incomeTaxAmount ?? 0;
  const totalExpenses = expensesData?.totalExpenses ?? 0;
  const netIncome = grossIncome - incomeTax;
  const netCashFlow = netIncome - totalExpenses;
  const savingsRate = netIncome > 0 ? (netCashFlow / netIncome) * 100 : null;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Total Gross Income</DescriptionTerm>
        <DescriptionDetails>{formatNumber(grossIncome, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Income Tax</DescriptionTerm>
        <DescriptionDetails>{formatNumber(incomeTax, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Net Income</DescriptionTerm>
        <DescriptionDetails>{formatNumber(netIncome, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Total Expenses</DescriptionTerm>
        <DescriptionDetails>{formatNumber(totalExpenses, 2, '$')}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Savings Rate</DescriptionTerm>
        <DescriptionDetails className="font-bold">{savingsRate !== null ? `${formatNumber(savingsRate, 1)}%` : 'N/A'}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Net</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(netCashFlow, 2, '$')}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

function TaxesDataListCardV2({ dp }: DataListCardProps) {
  const portfolioData = dp.portfolio;

  const realizedGains = portfolioData.realizedGainsForPeriod;

  let taxDeferredWithdrawals = 0;
  for (const account of Object.values(portfolioData.perAccountData)) {
    switch (account.type) {
      case '401k':
      case 'ira':
      case 'hsa':
        taxDeferredWithdrawals += account.withdrawalsForPeriod;
        break;
      default:
        break;
    }
  }

  const incomesData = dp.incomes;
  const taxesData = dp.taxes;

  const ordinaryIncome = incomesData?.totalGrossIncome ?? 0;
  const grossIncome = ordinaryIncome + taxDeferredWithdrawals;
  const incomeTax = taxesData?.incomeTaxes.incomeTaxAmount ?? 0;
  const capGainsTax = taxesData?.capitalGainsTaxes.capitalGainsTaxAmount ?? 0;
  const totalTaxLiability = incomeTax + capGainsTax;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Total Gross Income</DescriptionTerm>
        <DescriptionDetails>{formatNumber(grossIncome, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Income Tax</DescriptionTerm>
        <DescriptionDetails>{formatNumber(incomeTax, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Realized Capital Gains</DescriptionTerm>
        <DescriptionDetails>{formatNumber(realizedGains, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Capital Gains Tax</DescriptionTerm>
        <DescriptionDetails>{formatNumber(capGainsTax, 2, '$')}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Total Tax Liability</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(totalTaxLiability, 2, '$')}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

function ReturnsDataListCardV2({ dp }: DataListCardProps) {
  const portfolioData = dp.portfolio;
  const totalValue = portfolioData.totalValue;

  const assetAllocation = portfolioData.assetAllocation ?? { stocks: 0, bonds: 0, cash: 0 };
  const stocksAllocation = assetAllocation.stocks;
  const bondsAllocation = assetAllocation.bonds;
  const cashAllocation = assetAllocation.cash;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Stocks</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(totalValue * stocksAllocation, 2, '$')} (${formatNumber(stocksAllocation * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Bonds</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(totalValue * bondsAllocation, 2, '$')} (${formatNumber(bondsAllocation * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Cash</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(totalValue * cashAllocation, 2, '$')} (${formatNumber(cashAllocation * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Total Portfolio Value</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(totalValue, 2, '$')}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

function ContributionsDataListCardV2({ dp }: DataListCardProps) {
  const portfolioData = dp.portfolio;
  const totalValue = portfolioData.totalValue;

  let cashSavings = 0;
  let taxable = 0;
  let taxDeferred = 0;
  let taxFree = 0;

  let taxDeferredWithdrawals = 0;

  for (const account of Object.values(portfolioData.perAccountData)) {
    switch (account.type) {
      case 'savings':
        cashSavings += account.totalValue;
        break;
      case 'taxableBrokerage':
        taxable += account.totalValue;
        break;
      case '401k':
      case 'ira':
      case 'hsa':
        taxDeferred += account.totalValue;
        taxDeferredWithdrawals += account.withdrawalsForPeriod;
        break;
      case 'roth401k':
      case 'rothIra':
        taxFree += account.totalValue;
        break;
    }
  }

  const incomesData = dp.incomes;
  const expensesData = dp.expenses;
  const taxesData = dp.taxes;

  const ordinaryIncome = incomesData?.totalGrossIncome ?? 0;
  const grossIncome = ordinaryIncome + taxDeferredWithdrawals;
  const incomeTax = taxesData?.incomeTaxes.incomeTaxAmount ?? 0;
  const totalExpenses = expensesData?.totalExpenses ?? 0;
  const netIncome = grossIncome - incomeTax;
  const netCashFlow = netIncome - totalExpenses;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Taxable Brokerage</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxable, 2, '$')} (${formatNumber((taxable / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Tax Deferred</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxDeferred, 2, '$')} (${formatNumber((taxDeferred / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Tax Free</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxFree, 2, '$')} (${formatNumber((taxFree / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Cash Savings</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(cashSavings, 2, '$')} (${formatNumber((cashSavings / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Total Value</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(totalValue, 2, '$')}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Net Cash Flow</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(netCashFlow, 2, '$')}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

function WithdrawalsDataListCardV2({ dp }: DataListCardProps) {
  const portfolioData = dp.portfolio;
  const totalValue = portfolioData.totalValue;
  const totalWithdrawals = portfolioData.withdrawalsForPeriod;

  let cashSavings = 0;
  let taxable = 0;
  let taxDeferred = 0;
  let taxFree = 0;

  let taxDeferredWithdrawals = 0;

  for (const account of Object.values(portfolioData.perAccountData)) {
    switch (account.type) {
      case 'savings':
        cashSavings += account.totalValue;
        break;
      case 'taxableBrokerage':
        taxable += account.totalValue;
        break;
      case '401k':
      case 'ira':
      case 'hsa':
        taxDeferred += account.totalValue;
        taxDeferredWithdrawals += account.withdrawalsForPeriod;
        break;
      case 'roth401k':
      case 'rothIra':
        taxFree += account.totalValue;
        break;
    }
  }

  const incomesData = dp.incomes;
  const expensesData = dp.expenses;
  const taxesData = dp.taxes;

  const ordinaryIncome = incomesData?.totalGrossIncome ?? 0;
  const grossIncome = ordinaryIncome + taxDeferredWithdrawals;
  const incomeTax = taxesData?.incomeTaxes.incomeTaxAmount ?? 0;
  const totalExpenses = expensesData?.totalExpenses ?? 0;
  const netIncome = grossIncome - incomeTax;
  const netCashFlow = netIncome - totalExpenses;

  return (
    <Card className="my-0">
      <DescriptionList>
        <DescriptionTerm>Taxable Brokerage</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxable, 2, '$')} (${formatNumber((taxable / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Tax Deferred</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxDeferred, 2, '$')} (${formatNumber((taxDeferred / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Tax Free</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(taxFree, 2, '$')} (${formatNumber((taxFree / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm>Cash Savings</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber(cashSavings, 2, '$')} (${formatNumber((cashSavings / totalValue) * 100, 1)}%)`}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Total Value</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(totalValue, 2, '$')}</DescriptionDetails>

        <DescriptionTerm>Withdrawal Rate</DescriptionTerm>
        <DescriptionDetails>{`${formatNumber((totalWithdrawals / (totalValue + totalWithdrawals)) * 100, 1)}%`}</DescriptionDetails>

        <DescriptionTerm className="font-bold">Net Cash Flow</DescriptionTerm>
        <DescriptionDetails className="font-bold">{formatNumber(netCashFlow, 2, '$')}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

interface SingleSimulationDataListSectionProps {
  simulation: SimulationResult;
  selectedAge: number;
  currentCategory: SimulationCategory;
}

function SingleSimulationDataListSection({ simulation, selectedAge, currentCategory }: SingleSimulationDataListSectionProps) {
  const dp = useMemo(() => {
    return simulation.data.find((dp) => {
      const startAge = simulation.context.startAge;
      const startDateYear = new Date().getFullYear();
      const currDateYear = new Date(dp.date).getFullYear();

      return currDateYear - startDateYear + startAge === selectedAge;
    });
  }, [simulation, selectedAge]);

  if (!dp) return null;

  let dataListComponents = null;
  switch (currentCategory) {
    case SimulationCategory.Portfolio:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <PortfolioDataListCardV2 dp={dp} />
        </div>
      );
      break;
    case SimulationCategory.CashFlow:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <CashFlowDataListCardV2 dp={dp} />
        </div>
      );
      break;
    case SimulationCategory.Taxes:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <TaxesDataListCardV2 dp={dp} />
        </div>
      );
      break;
    case SimulationCategory.Returns:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <ReturnsDataListCardV2 dp={dp} />
        </div>
      );
      break;
    case SimulationCategory.Contributions:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <ContributionsDataListCardV2 dp={dp} />
        </div>
      );
      break;
    case SimulationCategory.Withdrawals:
      dataListComponents = (
        <div className="grid grid-cols-1 gap-2">
          <WithdrawalsDataListCardV2 dp={dp} />
        </div>
      );
      break;
  }

  return <SectionContainer showBottomBorder>{dataListComponents}</SectionContainer>;
}

// Memoize the entire section to prevent re-renders when props haven't changed
export default memo(SingleSimulationDataListSection);
