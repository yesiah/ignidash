'use client';

import { CalendarRangeIcon, CheckIcon } from 'lucide-react';

import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, DropdownLabel } from '@/components/catalyst/dropdown';
import { cn, formatChartString } from '@/lib/utils';
import { useChartTimeFrameToShow, useUpdateChartTimeFrameToShow } from '@/lib/stores/simulator-store';

export default function ChartTimeFrameDropdown() {
  const chartTimeFrameToShow = useChartTimeFrameToShow();
  const updateChartTimeFrameToShow = useUpdateChartTimeFrameToShow();

  const chartTimeFrameOptions = ['tenYears', 'twentyYears', 'thirtyYears', 'fullPlan'] as const;

  return (
    <Dropdown>
      <DropdownButton plain aria-label="Open chart view options">
        <CalendarRangeIcon data-slot="icon" />
      </DropdownButton>
      <DropdownMenu>
        {chartTimeFrameOptions.map((chartTimeFrameOption) => (
          <DropdownItem key={chartTimeFrameOption} onClick={() => updateChartTimeFrameToShow(chartTimeFrameOption)}>
            <CheckIcon data-slot="icon" className={cn({ invisible: chartTimeFrameToShow !== chartTimeFrameOption })} />
            <DropdownLabel>{formatChartString(chartTimeFrameOption)}</DropdownLabel>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
