"use client";

import { Card } from "@/components/card";
import { CoreInputs } from "./core-inputs";
import { CoastFIRE, BaristaFIRE } from "./alternative-paths";
import { RightChevronButton } from "@/components/right-chevron-button";
import { useState } from "react";
import Drawer from "@/components/drawer";

export function YourNumbersContent() {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <>
      <div className="border-foreground/10 mb-5 border-b pb-5">
        <div className="ml-2">
          <h4 className="text-base font-semibold">Foundation</h4>
          <p className="text-muted-foreground mt-2 text-sm">
            The core numbers needed to estimate your financial independence
            timeline.
          </p>
        </div>

        <Card>
          <CoreInputs />
        </Card>

        <RightChevronButton
          title="Configuration"
          onClick={() => setAdvancedOpen(true)}
        />
      </div>
      <div className="border-foreground/10 mb-5 border-b pb-5">
        <div className="ml-2">
          <h4 className="text-base font-semibold">Alternative Paths</h4>
          <p className="text-muted-foreground mt-2 text-sm">
            Full retirement isn&apos;t your only option. Explore proven
            strategies for earlier freedom.
          </p>
        </div>
        <Card>
          <CoastFIRE />
        </Card>
        <Card>
          <BaristaFIRE />
        </Card>
      </div>
      <Drawer
        open={advancedOpen}
        setOpen={setAdvancedOpen}
        title="Configuration"
        desc="Fine-tune how your Foundation numbers are used in projections."
      >
        {/* TODO: Advanced drawer content to be implemented */}
      </Drawer>
    </>
  );
}
