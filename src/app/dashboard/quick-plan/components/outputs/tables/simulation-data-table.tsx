'use client';

import { useFixedReturnsTableData } from '@/lib/stores/quick-plan-store';
import { type SimulationTableRow } from '@/lib/schemas/simulation-table-schema';
import { SIMULATION_TABLE_COLUMNS } from '@/lib/utils/table-formatters';

import Table from './table';

export default function SimulationDataTable() {
  const tableData = useFixedReturnsTableData();

  return <Table<SimulationTableRow> columns={SIMULATION_TABLE_COLUMNS} data={tableData} keyField="year" />;
}
