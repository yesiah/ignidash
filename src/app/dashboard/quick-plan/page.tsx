import { MainArea } from "../components/main-area";
import { SecondaryColumn } from "../components/secondary-column";

export default function QuickPlanPage() {
  return (
    <>
      <MainArea>
        <div className="border-foreground/10 dark:border-foreground/10 border-b pb-5">
          <h3 className="font-display text-lg font-semibold text-gray-900 lg:text-xl dark:text-gray-100">
            Results
          </h3>
        </div>
      </MainArea>
      <SecondaryColumn>
        <div className="border-foreground/10 dark:border-foreground/10 border-b pb-5">
          <h3 className="font-display text-lg font-semibold text-gray-900 lg:text-xl dark:text-gray-100">
            Your Numbers
          </h3>
        </div>
      </SecondaryColumn>
    </>
  );
}
