'use client';

import { useState, useMemo } from 'react';
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid';

import { useMonteCarloTableData, useSimulationDetailData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow, type MonteCarloTableRow } from '@/lib/schemas/simulation-table-schema';
import { generateMonteCarloTableColumns, generateSimulationTableColumns } from '@/lib/utils/table-formatters';
import type { MultiSimulationResult } from '@/lib/calc/simulation-engine';
import { Button } from '@/components/catalyst/button';

import Table from './table';

interface MonteCarloDataTableProps {
  simulation: MultiSimulationResult;
}

export default function MonteCarloDataTable({ simulation }: MonteCarloDataTableProps) {
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);

  // Find the selected simulation result
  const selectedSimulation = useMemo(() => {
    if (selectedSeed === null) return null;

    const selectedSimulation = simulation.simulations.find(([seed]) => seed === selectedSeed);
    return selectedSimulation ? selectedSimulation[1] : null;
  }, [selectedSeed, simulation]);

  const tableData = useMonteCarloTableData(simulation);
  const tableDataColumns = useMemo(() => generateMonteCarloTableColumns(), []);

  const detailData = useSimulationDetailData(selectedSimulation);
  const detailDataColumns = useMemo(() => generateSimulationTableColumns(), []);

  const handleRowClick = (row: MonteCarloTableRow) => setSelectedSeed(row.seed);
  const handleBack = () => setSelectedSeed(null);

  const headerText = selectedSeed !== null ? `Simulation #${selectedSeed} Details` : 'Monte Carlo Simulations';
  const tableComponent =
    selectedSeed !== null ? (
      <Table<SimulationTableRow> columns={detailDataColumns} data={detailData} keyField="year" />
    ) : (
      <Table<MonteCarloTableRow> columns={tableDataColumns} data={tableData} keyField="seed" onRowClick={handleRowClick} />
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
