'use client';

import { useMemo } from 'react';

import { useMonteCarloTableData, useSimulationDetailTableData, useMonteCarloYearlyResultsTableData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow, type MonteCarloTableRow, type YearlyAggregateTableRow } from '@/lib/schemas/simulation-table-schema';
import {
  generateMonteCarloTableColumns,
  generateSimulationTableColumns,
  generateYearlyAggregateTableColumns,
} from '@/lib/utils/table-formatters';
import type { MultiSimulationResult } from '@/lib/calc/simulation-engine';

import Table from './table';

interface MonteCarloDataTableProps {
  simulation: MultiSimulationResult;
  selectedSeed: number | null;
  setSelectedSeed: (seed: number | null) => void;
  viewMode: 'all' | 'yearly';
}

export default function MonteCarloDataTable({ simulation, selectedSeed, setSelectedSeed, viewMode }: MonteCarloDataTableProps) {
  // Find the selected simulation result
  const selectedSimulation = useMemo(() => {
    if (selectedSeed === null) return null;

    const selectedSimulation = simulation.simulations.find(([seed]) => seed === selectedSeed);
    return selectedSimulation ? selectedSimulation[1] : null;
  }, [selectedSeed, simulation]);

  const allSimulationData = useMonteCarloTableData(simulation);
  const yearlyData = useMonteCarloYearlyResultsTableData(simulation);
  const detailData = useSimulationDetailTableData(selectedSimulation);

  const allSimulationColumns = useMemo(() => generateMonteCarloTableColumns(), []);
  const yearlyColumns = useMemo(() => generateYearlyAggregateTableColumns(), []);
  const detailDataColumns = useMemo(() => generateSimulationTableColumns(), []);

  const handleRowClick = (row: MonteCarloTableRow) => setSelectedSeed(row.seed);

  // When viewing a specific simulation detail
  if (selectedSeed !== null) {
    return (
      <Table<SimulationTableRow> columns={detailDataColumns} data={detailData} keyField="year" onEscPressed={() => setSelectedSeed(null)} />
    );
  }

  // When viewing yearly aggregated results
  if (viewMode === 'yearly') {
    return <Table<YearlyAggregateTableRow> columns={yearlyColumns} data={yearlyData} keyField="year" />;
  }

  // Default: viewing all simulations
  return <Table<MonteCarloTableRow> columns={allSimulationColumns} data={allSimulationData} keyField="seed" onRowClick={handleRowClick} />;
}
