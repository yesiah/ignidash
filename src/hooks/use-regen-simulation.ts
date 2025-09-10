import { RefreshCwIcon } from 'lucide-react';

import { useGenerateNewSeed } from '@/lib/stores/quick-plan-store';

export function useRegenSimulation() {
  const generateNewSeed = useGenerateNewSeed();

  return {
    icon: RefreshCwIcon,
    label: 'Regenerate simulation',
    handleClick: generateNewSeed,
    className: 'hover:-rotate-180 transition-transform duration-300',
  };
}
