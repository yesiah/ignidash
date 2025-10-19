import { RefreshCwIcon } from 'lucide-react';

import { useUpdateSimulationSeed, useSimulationStatus } from '@/lib/stores/quick-plan-store';

export function useRegenSimulation() {
  const updateSimulationSeed = useUpdateSimulationSeed();
  const simulationStatus = useSimulationStatus();
  const isDisabled = simulationStatus === 'loading';

  const handleClick = () => {
    if (!isDisabled) updateSimulationSeed();
  };

  return {
    icon: RefreshCwIcon,
    label: 'Regenerate simulation',
    handleClick,
    isDisabled,
  };
}
