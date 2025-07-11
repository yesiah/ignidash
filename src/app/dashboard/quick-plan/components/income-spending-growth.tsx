"use client";

import { useState } from "react";
import { NumberField } from "@/components/number-field";
import { FormSection } from "@/components/form-section";

export function IncomeSpendingGrowth() {
  // Growth rates state
  const [incomeGrowthRate, setIncomeGrowthRate] = useState("3");
  const [expenseGrowthRate, setExpenseGrowthRate] = useState("3");

  return (
    <>
      <FormSection title="Net Annual Income">
        <NumberField
          id="income-growth-rate"
          label="Income Growth Rate (%)"
          value={incomeGrowthRate}
          onChange={(e) => setIncomeGrowthRate(e.target.value)}
          placeholder="3"
          min="0"
          max="50"
          step="0.1"
          desc="Annual raise percentage. 0% loses purchasing power to inflation."
        />
      </FormSection>

      <FormSection title="Annual Expenses" hasBorder={false}>
        <NumberField
          id="expense-growth-rate"
          label="Expense Growth Rate (%)"
          value={expenseGrowthRate}
          onChange={(e) => setExpenseGrowthRate(e.target.value)}
          placeholder="3"
          min="0"
          max="10"
          step="0.1"
          desc="Annual spending increase. 0% means buying less as prices rise due to inflation."
        />
      </FormSection>
    </>
  );
}
