'use client';

import { useMemo } from 'react';

import { useHistoricalBacktestTableData, useSimulationDetailData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow, type HistoricalBacktestTableRow } from '@/lib/schemas/simulation-table-schema';
import { generateHistoricalBacktestTableColumns, generateSimulationTableColumns } from '@/lib/utils/table-formatters';
import type { LcgHistoricalBacktestResult } from '@/lib/calc/simulation-engine';

import Table from './table';

interface HistoricalBacktestDataTableProps {
  simulation: LcgHistoricalBacktestResult;
  selectedSeed: number | null;
  setSelectedSeed: (seed: number | null) => void;
}

export default function HistoricalBacktestDataTable({ simulation, selectedSeed, setSelectedSeed }: HistoricalBacktestDataTableProps) {
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

  return selectedSeed !== null ? (
    <Table<SimulationTableRow> columns={detailDataColumns} data={detailData} keyField="year" />
  ) : (
    <Table<HistoricalBacktestTableRow> columns={tableDataColumns} data={tableData} keyField="seed" onRowClick={handleRowClick} />
  );
}
