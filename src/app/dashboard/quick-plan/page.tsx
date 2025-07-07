import { MainArea } from "../components/main-area";
import { SecondaryColumn } from "../components/secondary-column";
import {
  CalculatorIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/card";
import { CoreInputs } from "./components/core-inputs";
import { AlternativePaths } from "./components/alternative-paths";

export default function QuickPlanPage() {
  return (
    <>
      <MainArea>
        <div className="border-foreground/10 mb-5 border-b pb-5">
          <h3 className="font-display flex items-center gap-2 text-lg font-semibold text-gray-900 lg:text-xl dark:text-gray-100">
            <PresentationChartLineIcon className="h-5 w-5" />
            Results
          </h3>
        </div>
      </MainArea>
      <SecondaryColumn>
        <div className="border-foreground/10 mb-5 border-b pb-5">
          <h3 className="font-display flex items-center gap-2 text-lg font-semibold text-gray-900 lg:text-xl dark:text-gray-100">
            <CalculatorIcon className="h-5 w-5" />
            Your Numbers
          </h3>
        </div>
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
        </div>
        <div className="border-foreground/10 mb-5 border-b pb-5">
          <div className="ml-2">
            <h4 className="text-base font-semibold">Alternative Paths</h4>
            <p className="text-muted-foreground mt-2 text-sm">
              Discover hybrid approaches that combine partial work and
              investment growth for earlier lifestyle flexibility.
            </p>
          </div>
          <Card>
            <AlternativePaths />
          </Card>
        </div>
      </SecondaryColumn>
    </>
  );
}
