'use client';

import { EyeIcon, CheckIcon } from 'lucide-react';

import { cn, formatChartString } from '@/lib/utils';
import Card from '@/components/ui/card';
import { Select } from '@/components/catalyst/select';
import type { SingleSimulationTaxesChartDataPoint } from '@/lib/types/chart-data-points';
import { useShowReferenceLines } from '@/lib/stores/quick-plan-store';
import type { KeyMetrics } from '@/lib/types/key-metrics';
import { Subheading } from '@/components/catalyst/heading';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu, DropdownLabel } from '@/components/catalyst/dropdown';

import SingleSimulationTaxesLineChart from '../../charts/single-simulation/single-simulation-taxes-line-chart';

interface SingleSimulationTaxesLineChartCardProps {
  onAgeSelect: (age: number) => void;
  selectedAge: number;
  setDataView: (view: 'marginalRates' | 'effectiveRates' | 'annualAmounts' | 'totalAmounts' | 'netIncome' | 'taxableIncome') => void;
  dataView: 'marginalRates' | 'effectiveRates' | 'annualAmounts' | 'totalAmounts' | 'netIncome' | 'taxableIncome';
  rawChartData: SingleSimulationTaxesChartDataPoint[];
  keyMetrics: KeyMetrics;
  startAge: number;
  setReferenceLineMode: (mode: 'hideReferenceLines' | 'showMarginalCapGainsRates' | 'showMarginalIncomeRates') => void;
  referenceLineMode: 'hideReferenceLines' | 'showMarginalCapGainsRates' | 'showMarginalIncomeRates';
  referenceLineModes: readonly ('hideReferenceLines' | 'showMarginalCapGainsRates' | 'showMarginalIncomeRates')[];
}

export default function SingleSimulationTaxesLineChartCard({
  onAgeSelect,
  selectedAge,
  setDataView,
  dataView,
  rawChartData,
  keyMetrics,
  startAge,
  setReferenceLineMode: setCurrentReferenceLineMode,
  referenceLineMode: currReferenceLineMode,
  referenceLineModes,
}: SingleSimulationTaxesLineChartCardProps) {
  const showReferenceLines = useShowReferenceLines();

  return (
    <Card className="my-0">
      <div className="mb-4 flex items-center justify-between">
        <Subheading level={4}>
          <span className="mr-2">Taxes</span>
          <span className="text-muted-foreground hidden sm:inline">Time Series</span>
        </Subheading>
        <div className="flex items-center gap-2">
          {dataView === 'taxableIncome' && (
            <Dropdown>
              <DropdownButton plain aria-label="Open chart view options">
                <EyeIcon data-slot="icon" />
              </DropdownButton>
              <DropdownMenu>
                {referenceLineModes.map((referenceLineMode) => (
                  <DropdownItem key={referenceLineMode} onClick={() => setCurrentReferenceLineMode(referenceLineMode)}>
                    <CheckIcon data-slot="icon" className={cn({ invisible: currReferenceLineMode !== referenceLineMode })} />
                    <DropdownLabel>{formatChartString(referenceLineMode)}</DropdownLabel>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          <Select
            className="max-w-48 sm:max-w-64"
            id="taxes-data-view"
            name="taxes-data-view"
            value={dataView}
            onChange={(e) =>
              setDataView(
                e.target.value as 'marginalRates' | 'effectiveRates' | 'annualAmounts' | 'totalAmounts' | 'netIncome' | 'taxableIncome'
              )
            }
          >
            <optgroup label="Tax Rates">
              <option value="marginalRates">Top Marginal Rates</option>
              <option value="effectiveRates">Effective Rates</option>
            </optgroup>
            <optgroup label="Tax Amounts">
              <option value="taxableIncome">Taxable Income</option>
              <option value="netIncome">Net Income After Tax</option>
              <option value="annualAmounts">Annual Taxes</option>
              <option value="totalAmounts">Total Taxes</option>
            </optgroup>
          </Select>
        </div>
      </div>
      <SingleSimulationTaxesLineChart
        onAgeSelect={onAgeSelect}
        selectedAge={selectedAge}
        rawChartData={rawChartData}
        keyMetrics={keyMetrics}
        showReferenceLines={showReferenceLines}
        dataView={dataView}
        startAge={startAge}
        referenceLineMode={dataView === 'taxableIncome' ? currReferenceLineMode : null}
      />
    </Card>
  );
}
