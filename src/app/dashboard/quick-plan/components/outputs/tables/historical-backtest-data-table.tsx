'use client';

import { useState, useMemo } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid';

import { useHistoricalBacktestTableData, useSimulationDetailData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow, type HistoricalBacktestTableRow } from '@/lib/schemas/simulation-table-schema';
import { generateHistoricalBacktestTableColumns, generateSimulationTableColumns } from '@/lib/utils/table-formatters';
import type { LcgHistoricalBacktestResult } from '@/lib/calc/simulation-engine';
import { Button } from '@/components/catalyst/button';

import Table from './table';

interface HistoricalBacktestDataTableProps {
  simulation: LcgHistoricalBacktestResult;
}

export default function HistoricalBacktestDataTable({ simulation }: HistoricalBacktestDataTableProps) {
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);

  // Find the selected simulation result
  const selectedSimulation = useMemo(() => {
    if (selectedSeed === null) return null;

    const selectedSimulation = simulation.simulations.find(([seed]) => seed === selectedSeed);
    return selectedSimulation ? selectedSimulation[1] : null;
  }, [selectedSeed, simulation]);

  const tableData = useHistoricalBacktestTableData(simulation);
  const tableDataColumns = useMemo(() => generateHistoricalBacktestTableColumns(), []);

  const detailData = useSimulationDetailData(selectedSimulation);
  const detailDataColumns = useMemo(() => generateSimulationTableColumns(), []);

  const handleRowClick = (row: HistoricalBacktestTableRow) => setSelectedSeed(row.seed);
  const handleBack = () => setSelectedSeed(null);

  const headerText = selectedSeed !== null ? `Simulation #${selectedSeed} Details` : 'Historical Backtest Simulations';
  const tableComponent =
    selectedSeed !== null ? (
      <Table<SimulationTableRow> columns={detailDataColumns} data={detailData} keyField="year" />
    ) : (
      <Table<HistoricalBacktestTableRow> columns={tableDataColumns} data={tableData} keyField="seed" onRowClick={handleRowClick} />
    );

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{headerText}</h3>
        <div className="ml-2">
          <Button disabled={selectedSeed === null} onClick={handleBack} plain>
            <ArrowLongLeftIcon className="h-5 w-5" />
            <span>Return</span>
          </Button>
        </div>
      </div>
      {tableComponent}
    </>
  );
}
