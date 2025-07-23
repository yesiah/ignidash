'use client';

import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

import NumberInput from '@/components/ui/number-input';
import DisclosureCard from '@/components/ui/disclosure-card';
import { useGrowthRatesData, useUpdateGrowthRates, useIncomeRealGrowthRate, useExpenseRealGrowthRate } from '@/lib/stores/quick-plan-store';

export default function IncomeSpendingGrowth() {
  const growthRates = useGrowthRatesData();
  const updateGrowthRates = useUpdateGrowthRates();

  const incomeRealGrowthRate = useIncomeRealGrowthRate();
  const expenseRealGrowthRate = useExpenseRealGrowthRate();

  return (
    <DisclosureCard
      title="Income & Spending Growth"
      desc="Set expected nominal growth rates for income and spending over time."
      icon={ArrowTrendingUpIcon}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4">
          <legend className="sr-only">Income and spending growth rate projections</legend>
          <NumberInput
            id="income-growth-rate"
            label={
              <div className="flex w-full items-center justify-between">
                <span>Income Growth Rate (%)</span>
                <span className="text-muted-foreground text-sm/6">{incomeRealGrowthRate.toFixed(1)}% real</span>
              </div>
            }
            value={growthRates.incomeGrowthRate}
            onBlur={(value) => updateGrowthRates('incomeGrowthRate', value)}
            inputMode="decimal"
            placeholder="3%"
            suffix="%"
          />
          <NumberInput
            id="expense-growth-rate"
            label={
              <div className="flex w-full items-center justify-between">
                <span>Spending Growth Rate (%)</span>
                <span className="text-muted-foreground text-sm/6">{expenseRealGrowthRate.toFixed(1)}% real</span>
              </div>
            }
            value={growthRates.expenseGrowthRate}
            onBlur={(value) => updateGrowthRates('expenseGrowthRate', value)}
            inputMode="decimal"
            placeholder="3%"
            suffix="%"
          />
        </fieldset>
      </form>
    </DisclosureCard>
  );
}
