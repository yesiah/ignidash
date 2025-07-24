import { QuickPlanInputs } from '@/lib/schemas/quick-plan-schema';

import { Portfolio, PortfolioChange } from './portfolio';

export interface CashFlow {
  id: string;
  name: string;
  shouldApply(year: number, currentAge: number, portfolio: Portfolio, inputs: QuickPlanInputs): boolean;
  calculateChange(
    year: number,
    currentAge: number,
    portfolio: Portfolio,
    inputs: QuickPlanInputs,
    accumulatedChange: PortfolioChange
  ): PortfolioChange;
}
