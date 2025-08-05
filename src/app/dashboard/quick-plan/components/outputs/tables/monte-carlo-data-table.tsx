'use client';

import { useMemo } from 'react';

import { useMonteCarloTableData, useSimulationDetailData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow, type MonteCarloTableRow } from '@/lib/schemas/simulation-table-schema';
import { generateMonteCarloTableColumns, generateSimulationTableColumns } from '@/lib/utils/table-formatters';
import type { MultiSimulationResult } from '@/lib/calc/simulation-engine';

import Table from './table';

interface MonteCarloDataTableProps {
  simulation: MultiSimulationResult;
  selectedSeed: number | null;
  setSelectedSeed: (seed: number | null) => void;
}

export default function MonteCarloDataTable({ simulation, selectedSeed, setSelectedSeed }: MonteCarloDataTableProps) {
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

  return selectedSeed !== null ? (
    <Table<SimulationTableRow> columns={detailDataColumns} data={detailData} keyField="year" />
  ) : (
    <Table<MonteCarloTableRow> columns={tableDataColumns} data={tableData} keyField="seed" onRowClick={handleRowClick} />
  );
}
