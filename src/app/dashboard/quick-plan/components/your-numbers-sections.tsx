"use client";

import { Card } from "@/components/card";
import { BasicsInputs } from "./basics-inputs";
import { CoastFIRE, BaristaFIRE } from "./goal-strategy-options";
import { DrawerTriggerButton } from "@/components/drawer-trigger-button";
import { useState } from "react";
import Drawer from "@/components/drawer";
import { IncomeSpendingDrawer } from "./income-spending-drawer";
import { InvestmentPortfolioDrawer } from "./investment-portfolio-drawer";
import { MarketAssumptionsDrawer } from "./market-assumptions-drawer";
import { RetirementFundingDrawer } from "./retirement-funding-drawer";
import {
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { NumberField } from "@/components/number-field";

export function YourNumbersSections() {
  // Fine-Tune drawer states
  const [incomeSpendingGrowthOpen, setIncomeSpendingGrowthOpen] =
    useState(false);
  const [investmentPortfolioOpen, setInvestmentPortfolioOpen] = useState(false);
  const [marketAssumptionsOpen, setMarketAssumptionsOpen] = useState(false);
  const [retirementFundingOpen, setRetirementFundingOpen] = useState(false);

  // Basics inputs state
  const [currentAge, setCurrentAge] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [annualExpenses, setAnnualExpenses] = useState("");
  const [investedAssets, setInvestedAssets] = useState("");

  // Goal inputs state
  const [retirementExpenses, setRetirementExpenses] = useState("");

  return (
    <>
      <div className="border-foreground/10 mb-5 border-b pb-5">
        <div className="ml-2">
          <h4 className="text-base font-semibold">Basics</h4>
          <p className="text-muted-foreground mt-2 text-sm">
            The core numbers needed to estimate your financial independence
            timeline.
          </p>
        </div>

        <Card>
          <BasicsInputs
            currentAge={currentAge}
            setCurrentAge={setCurrentAge}
            annualIncome={annualIncome}
            setAnnualIncome={setAnnualIncome}
            annualExpenses={annualExpenses}
            setAnnualExpenses={setAnnualExpenses}
            investedAssets={investedAssets}
            setInvestedAssets={setInvestedAssets}
          />
        </Card>
      </div>
      <div className="border-foreground/10 mb-5 border-b pb-5">
        <div className="ml-2">
          <h4 className="text-base font-semibold">Goal</h4>
          <p className="text-muted-foreground mt-2 text-sm">
            Full retirement isn&apos;t your only option. Explore proven
            strategies for earlier freedom.
          </p>
        </div>
        <Card>
          <NumberField
            id="retirement-expenses"
            label="Retirement Expenses"
            value={retirementExpenses}
            onChange={(e) => setRetirementExpenses(e.target.value)}
            placeholder={annualExpenses || "$50,000"}
          />
        </Card>
        <Card>
          <CoastFIRE />
        </Card>
        <Card>
          <BaristaFIRE />
        </Card>
      </div>
      <div className="mb-5 space-y-4 pb-5">
        <div className="ml-2">
          <h4 className="text-base font-semibold">Fine-Tune</h4>
          <p className="text-muted-foreground mt-2 text-sm">
            Adjust advanced settings to refine your projections and assumptions.
          </p>
        </div>

        <DrawerTriggerButton
          title="Income & Spending Growth"
          leftIcon={ArrowTrendingUpIcon}
          onClick={() => setIncomeSpendingGrowthOpen(true)}
        />

        <DrawerTriggerButton
          title="Investment Portfolio"
          leftIcon={ChartPieIcon}
          onClick={() => setInvestmentPortfolioOpen(true)}
        />

        <DrawerTriggerButton
          title="Market & Economic Assumptions"
          leftIcon={ChartBarIcon}
          onClick={() => setMarketAssumptionsOpen(true)}
        />

        <DrawerTriggerButton
          title="Retirement Funding & Duration"
          leftIcon={ClockIcon}
          onClick={() => setRetirementFundingOpen(true)}
        />
      </div>

      {/* Fine-Tune drawers */}
      <Drawer
        open={incomeSpendingGrowthOpen}
        setOpen={setIncomeSpendingGrowthOpen}
        title="Income & Spending Growth"
        desc="Set growth rates for income and expenses over time."
      >
        <IncomeSpendingDrawer />
      </Drawer>

      <Drawer
        open={investmentPortfolioOpen}
        setOpen={setInvestmentPortfolioOpen}
        title="Investment Portfolio"
        desc="Configure your asset allocation across stocks, bonds, and cash."
      >
        <InvestmentPortfolioDrawer />
      </Drawer>

      <Drawer
        open={marketAssumptionsOpen}
        setOpen={setMarketAssumptionsOpen}
        title="Market & Economic Assumptions"
        desc="Set expected returns and economic projections."
      >
        <MarketAssumptionsDrawer />
      </Drawer>

      <Drawer
        open={retirementFundingOpen}
        setOpen={setRetirementFundingOpen}
        title="Retirement Funding & Duration"
        desc="Configure withdrawal rates and life expectancy."
      >
        <RetirementFundingDrawer />
      </Drawer>
    </>
  );
}
