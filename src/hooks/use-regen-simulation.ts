import { RefreshCwIcon } from 'lucide-react';

import { useUpdateSimulationSeed } from '@/lib/stores/quick-plan-store';

export function useRegenSimulation() {
  const updateSimulationSeed = useUpdateSimulationSeed();

  return {
    icon: RefreshCwIcon,
    label: 'Regenerate simulation',
    handleClick: updateSimulationSeed,
    className: 'hover:-rotate-180 transition-transform duration-300',
  };
}
