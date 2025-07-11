"use client";

import { MainArea } from "../components/main-area";
import { SecondaryColumn } from "../components/secondary-column";
import { SectionSelector } from "./components/section-selector";
import { ResultsSections } from "./components/results-sections";
import { ResultsPageHeader } from "./components/results-page-header";
import { YourNumbersSections } from "./components/your-numbers-sections";
import { YourNumbersPageHeader } from "./components/your-numbers-page-header";
import { useState } from "react";

type ActiveSection = "results" | "your-numbers";

export default function QuickPlanPage() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("your-numbers");

  return (
    <>
      <MainArea>
        <div className="block xl:hidden">
          <SectionSelector
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          {activeSection === "results" ? (
            <ResultsSections />
          ) : (
            <YourNumbersSections />
          )}
        </div>
        <div className="hidden xl:block">
          <ResultsPageHeader />
          <ResultsSections />
        </div>
      </MainArea>
      <SecondaryColumn>
        <YourNumbersPageHeader />
        <YourNumbersSections />
      </SecondaryColumn>
    </>
  );
}
