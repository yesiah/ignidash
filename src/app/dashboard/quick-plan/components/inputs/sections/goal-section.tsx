"use client";

import { Card } from "@/components/ui/card";
import {
  CoastFIRE,
  BaristaFIRE,
} from "../strategy-options/goal-strategy-options";
import { NumberField } from "@/components/ui/number-field";
import { SectionHeader } from "@/components/layout/section-header";

interface GoalSectionProps {
  retirementExpenses: string;
  setRetirementExpenses: (value: string) => void;
  annualExpenses: string;
  targetRetirementAge: string;
  setTargetRetirementAge: (value: string) => void;
  partTimeIncome: string;
  setPartTimeIncome: (value: string) => void;
}

export function GoalSection({
  retirementExpenses,
  setRetirementExpenses,
  annualExpenses,
  targetRetirementAge,
  setTargetRetirementAge,
  partTimeIncome,
  setPartTimeIncome,
}: GoalSectionProps) {
  return (
    <div className="border-foreground/10 mb-5 border-b pb-5">
      <SectionHeader
        title="Retirement Goal"
        desc="Your retirement spending level determines when you'll have enough to retire.
          Consider optional strategies for getting there."
      />
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset className="space-y-4">
          <legend className="sr-only">
            Retirement goal and strategy options
          </legend>
          <Card>
            <NumberField
              id="retirement-expenses"
              label="Retirement Expenses"
              value={retirementExpenses}
              onChange={(e) => setRetirementExpenses(e.target.value)}
              placeholder={annualExpenses || "$50,000"}
            />
          </Card>
          <CoastFIRE
            targetRetirementAge={targetRetirementAge}
            setTargetRetirementAge={setTargetRetirementAge}
          />
          <BaristaFIRE
            partTimeIncome={partTimeIncome}
            setPartTimeIncome={setPartTimeIncome}
          />
        </fieldset>
      </form>
    </div>
  );
}
