import { MainArea } from "../components/main-area";
import { SecondaryColumn } from "../components/secondary-column";

export default function QuickPlanPage() {
  return (
    <>
      <MainArea>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Quick Plan
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Create and manage your quick plans efficiently.
          </p>
        </div>
      </MainArea>
      <SecondaryColumn>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                Create New Plan
              </button>
              <button className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Import Plan
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Plans
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No recent plans found.
              </p>
            </div>
          </div>
        </div>
      </SecondaryColumn>
    </>
  );
}
