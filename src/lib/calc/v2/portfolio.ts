import type { AccountInputs, InvestmentAccountType, InvestmentAccountInputs } from '@/lib/schemas/account-form-schema';

import type { SimulationState } from './simulation-engine';
import type { AssetReturnRates } from '../asset';

export interface PortfolioData {
  totalValue: number;
}

export class PortfolioProcessor {
  constructor(private simulationState: SimulationState) {}

  process(): void {
    // Process contributions (Needs income, taxes, expenses)
    // Process withdrawals (Needs net cash flow)
    // Process rebalance (Needs final portfolio state)

    return;
  }
}

export class Portfolio {
  private accounts: Account[];

  constructor(data: AccountInputs[]) {
    this.accounts = data.map((accountData) => {
      if (accountData.type !== 'savings') {
        return new InvestmentAccount(accountData as InvestmentAccountInputs);
      } else {
        return new SavingsAccount(accountData);
      }
    });
  }

  getTotalValue(): number {
    return this.accounts.reduce((acc, account) => acc + account.getCurrentValue(), 0);
  }

  applyReturns(returns: AssetReturnRates): void {
    this.accounts.forEach((account) => {
      account.applyReturns(returns);
    });
  }
}

export interface AccountData {
  name: string;
  currentValue: number;
}

export abstract class Account {
  constructor(protected currentValue: number) {}

  getCurrentValue(): number {
    return this.currentValue;
  }

  abstract applyReturns(returns: AssetReturnRates): void;
}

export class SavingsAccount extends Account {
  constructor(data: AccountInputs) {
    super(data.currentValue);
  }

  applyReturns(returns: AssetReturnRates): void {
    this.currentValue *= 1 + returns.cash;
  }
}

export class InvestmentAccount extends Account {
  private percentBonds: number;

  constructor(data: AccountInputs & { type: InvestmentAccountType }) {
    super(data.currentValue);
    this.percentBonds = data.percentBonds ?? 0;
  }

  applyReturns(returns: AssetReturnRates): void {
    const bondsPercent = this.percentBonds / 100;
    const stocksPercent = 1 - bondsPercent;

    const currentBondsValue = this.currentValue * bondsPercent;
    const currentStocksValue = this.currentValue * stocksPercent;

    const newBondsValue = currentBondsValue * (1 + returns.bonds);
    const newStocksValue = currentStocksValue * (1 + returns.stocks);

    this.currentValue = newBondsValue + newStocksValue;
    this.percentBonds = (newBondsValue / this.currentValue) * 100;
  }
}
