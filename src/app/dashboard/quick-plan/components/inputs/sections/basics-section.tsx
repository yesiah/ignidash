"use client";

import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { SectionHeader } from "@/components/layout/section-header";
import { DisclosureSection } from "@/components/layout/disclosure-section";
import { ArrowTrendingUpIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import {
  useBasicsData,
  useGrowthRatesData,
  useAllocationData,
  useUpdateBasics,
  useUpdateGrowthRates,
  useUpdateAllocation,
} from "@/lib/stores/quick-plan-store";

export function BasicsSection() {
  const basics = useBasicsData();
  const growthRates = useGrowthRatesData();
  const allocation = useAllocationData();

  const updateBasics = useUpdateBasics();
  const updateGrowthRates = useUpdateGrowthRates();
  const updateAllocation = useUpdateAllocation();

  return (
    <div className="border-foreground/10 mb-5 border-b pb-5">
      <SectionHeader
        title="Financial Foundation"
        desc="The core numbers needed to estimate your financial independence timeline."
      />

      <Card>
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset className="space-y-4">
            <legend className="sr-only">
              Basic financial information for FIRE calculation
            </legend>
            <NumberInput
              id="current-age"
              label="Current Age"
              value={basics.currentAge}
              onBlur={(value) => updateBasics("currentAge", value)}
              placeholder="28"
              min={16}
              max={100}
            />
            <NumberInput
              id="annual-income"
              label="Net Annual Income"
              value={basics.annualIncome}
              onBlur={(value) => updateBasics("annualIncome", value)}
              placeholder="$85,000"
              min={0}
            />
            <NumberInput
              id="annual-expenses"
              label="Annual Expenses"
              value={basics.annualExpenses}
              onBlur={(value) => updateBasics("annualExpenses", value)}
              placeholder="$50,000"
              min={0}
            />
            <NumberInput
              id="invested-assets"
              label="Invested Assets"
              value={basics.investedAssets}
              onBlur={(value) => updateBasics("investedAssets", value)}
              placeholder="$75,000"
              min={0}
            />
          </fieldset>
        </form>
      </Card>

      <div className="mt-4 space-y-4">
        <DisclosureSection
          title="Income & Spending Growth"
          desc="Set expected nominal growth rates for income and expenses over time."
          icon={<ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="space-y-4">
              <legend className="sr-only">
                Income and expense growth rate projections
              </legend>
              <NumberInput
                id="income-growth-rate"
                label="Income Growth Rate (%)"
                value={growthRates.incomeGrowthRate}
                onBlur={(value) => updateGrowthRates("incomeGrowthRate", value)}
                placeholder="3%"
                min={0}
                max={50}
                step={0.1}
              />
              <NumberInput
                id="expense-growth-rate"
                label="Expense Growth Rate (%)"
                value={growthRates.expenseGrowthRate}
                onBlur={(value) =>
                  updateGrowthRates("expenseGrowthRate", value)
                }
                placeholder="3%"
                min={0}
                max={10}
                step={0.1}
              />
            </fieldset>
          </form>
        </DisclosureSection>

        <DisclosureSection
          title="Investment Portfolio"
          desc="Configure asset allocation across stocks, bonds, and cash."
          icon={<ChartPieIcon className="h-5 w-5" aria-hidden="true" />}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="space-y-4">
              <legend className="sr-only">
                Asset allocation percentages for investment portfolio
              </legend>
              <NumberInput
                id="stock-allocation"
                label="Stocks (%)"
                value={allocation.stockAllocation}
                onBlur={(value) => updateAllocation("stockAllocation", value)}
                placeholder="70%"
                min={0}
                max={100}
                step={1}
              />
              <NumberInput
                id="bond-allocation"
                label="Bonds (%)"
                value={allocation.bondAllocation}
                onBlur={(value) => updateAllocation("bondAllocation", value)}
                placeholder="30%"
                min={0}
                max={100}
                step={1}
              />
              <NumberInput
                id="cash-allocation"
                label="Cash (%)"
                value={allocation.cashAllocation}
                onBlur={(value) => updateAllocation("cashAllocation", value)}
                placeholder="0%"
                min={0}
                max={100}
                step={1}
              />
            </fieldset>
          </form>
        </DisclosureSection>
      </div>
    </div>
  );
}
