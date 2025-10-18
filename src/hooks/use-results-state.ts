import { useCallback, useState } from 'react';

export function useResultsState(startAge: number) {
  const [selectedAge, setSelectedAge] = useState<number>(startAge + 1);
  const onAgeSelect = useCallback(
    (age: number) => {
      if (age >= startAge + 1) setSelectedAge(age);
    },
    [startAge]
  );

  return { selectedAge, onAgeSelect };
}
