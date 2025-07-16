import { useFIREAnalysis } from "@/lib/stores/quick-plan-store";
import { formatNumber } from "@/lib/utils";

export function ResultsOverview() {
  const fireAnalysis = useFIREAnalysis();

  const stats = [
    { name: "FIRE Age", stat: fireAnalysis.fireAge },
    { name: "Years to FIRE", stat: fireAnalysis.yearsToFIRE },
    { name: "Required Portfolio Size", stat: fireAnalysis.requiredPortfolio },
  ];

  return (
    <>
      <dl className="mt-5 grid grid-cols-1 sm:grid-cols-3">
        {stats.map((item, index) => (
          <div
            key={item.name}
            className={`px-4 py-5 sm:p-6 ${
              index < stats.length - 1
                ? "border-foreground/10 border-b sm:border-r sm:border-b-0"
                : ""
            }`}
          >
            <dt className="text-muted-foreground truncate text-sm font-medium">
              {item.name}
            </dt>
            <dd className="text-foreground mt-1 text-3xl font-semibold tracking-tight">
              {formatNumber(item.stat)}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
