import { useMemo, useCallback } from 'react';

import {
  useSelectedSeedFromTable,
  useQuickSelectPercentile,
  useUpdateQuickSelectPercentile,
  useUpdateSelectedSeedFromTable,
  useUpdateResultsCategory,
} from '@/lib/stores/quick-plan-store';
import type { MultiSimulationAnalysis } from '@/lib/calc/v2/multi-simulation-analyzer';
import { SimulationCategory } from '@/lib/types/simulation-category';

export function useActiveSeed(analysis: MultiSimulationAnalysis | undefined) {
  const selectedSeedFromTable = useSelectedSeedFromTable();
  const quickSelectPercentile = useQuickSelectPercentile();

  return useMemo(() => {
    if (selectedSeedFromTable !== null) {
      return { activeSeed: selectedSeedFromTable, activeSeedType: 'table' as const };
    } else if (quickSelectPercentile !== null) {
      return { activeSeed: analysis?.results[quickSelectPercentile].seed, activeSeedType: 'percentile' as const };
    } else {
      return { activeSeed: undefined };
    }
  }, [selectedSeedFromTable, quickSelectPercentile, analysis]);
}

export function useRemoveActiveSeed() {
  const updateQuickSelectPercentile = useUpdateQuickSelectPercentile();
  const updateSelectedSeedFromTable = useUpdateSelectedSeedFromTable();
  const updateResultsCategory = useUpdateResultsCategory();

  return useCallback(() => {
    updateQuickSelectPercentile(null);
    updateSelectedSeedFromTable(null);
    updateResultsCategory(SimulationCategory.Portfolio);
  }, [updateResultsCategory, updateQuickSelectPercentile, updateSelectedSeedFromTable]);
}
