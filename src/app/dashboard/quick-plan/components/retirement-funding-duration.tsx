"use client";

import { useState } from "react";
import { NumberField } from "@/components/number-field";
import { FormSection } from "@/components/form-section";

export function RetirementFundingDuration() {
  // Withdrawal strategy state
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState("4");

  // Life expectancy state
  const [lifeExpectancy, setLifeExpectancy] = useState("85");

  return (
    <>
      <FormSection title="Withdrawal Strategy">
        <NumberField
          id="safe-withdrawal-rate"
          label="Safe Withdrawal Rate (%)"
          value={safeWithdrawalRate}
          onChange={(e) => setSafeWithdrawalRate(e.target.value)}
          placeholder="4"
          min="2"
          max="6"
          step="0.1"
          desc={
            <>
              Annual portfolio withdrawal percentage.{" "}
              <a
                href="https://www.investopedia.com/terms/f/four-percent-rule.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-foreground/80 underline"
              >
                4% is standard.
              </a>{" "}
              Lower rates are more conservative.
            </>
          }
        />
      </FormSection>

      <FormSection title="Life Expectancy" hasBorder={false}>
        <NumberField
          id="life-expectancy"
          label="Life Expectancy (years)"
          value={lifeExpectancy}
          onChange={(e) => setLifeExpectancy(e.target.value)}
          placeholder="85"
          min="50"
          max="110"
          desc={
            <>
              Age you expect to live to. See{" "}
              <a
                href="https://www.cdc.gov/nchs/fastats/life-expectancy.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-foreground/80 underline"
              >
                CDC life expectancy data
              </a>{" "}
              for current averages.
            </>
          }
        />
      </FormSection>
    </>
  );
}
