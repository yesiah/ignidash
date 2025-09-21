import { useCallback, useState } from 'react';

import { SimulationCategory } from '@/lib/types/simulation-category';

export function useResultsState(startAge: number) {
  const [selectedAge, setSelectedAge] = useState<number>(startAge + 1);
  const onAgeSelect = useCallback(
    (age: number) => {
      if (age >= startAge + 1) setSelectedAge(age);
    },
    [startAge]
  );

  const [currentCategory, setCurrentCategory] = useState<SimulationCategory>(SimulationCategory.Portfolio);

  return { selectedAge, onAgeSelect, currentCategory, setCurrentCategory };
}
