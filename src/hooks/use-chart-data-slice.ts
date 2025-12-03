import { useMemo } from 'react';
import { useChartTimeFrameToShow } from '@/lib/stores/simulator-store';

export function useChartDataSlice<T>(data: T[]): T[] {
  const chartTimeFrameToShow = useChartTimeFrameToShow();

  return useMemo(() => {
    switch (chartTimeFrameToShow) {
      case 'tenYears':
        return data.slice(0, 10);
      case 'twentyYears':
        return data.slice(0, 20);
      case 'thirtyYears':
        return data.slice(0, 30);
      case 'fullPlan':
        return data;
      default:
        return data;
    }
  }, [data, chartTimeFrameToShow]);
}
