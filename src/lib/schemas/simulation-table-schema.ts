/**
 * Simulation Table Schema - Data Structure and Presentation Metadata
 *
 * This module provides Zod schema definitions for simulation table data along with
 * co-located presentation metadata. It defines both the data structure and how
 * each field should be displayed in table format.
 *
 * Features:
 * - Runtime validation of simulation data
 * - Type-safe table column generation
 * - Co-located data and presentation logic
 * - Automatic formatter assignment based on field types
 */

import { z } from 'zod';

// Zod schema for simulation table row data
export const simulationTableRowSchema = z.object({
  year: z.number(),
  age: z.number(),
  phaseName: z.string(),
  portfolioValue: z.number(),
  stocksValue: z.number(),
  stocksReturn: z.number().nullable(),
  bondsValue: z.number(),
  bondsReturn: z.number().nullable(),
  cashValue: z.number(),
  cashReturn: z.number().nullable(),
  inflationRate: z.number().nullable(),
});

// Infer TypeScript type from schema
export type SimulationTableRow = z.infer<typeof simulationTableRowSchema>;

// Format types for different data presentations
export type ColumnFormat = 'number' | 'currency' | 'percentage' | 'string';

// Define the structure with metadata
const SIMULATION_COLUMNS = {
  year: { title: 'Year', format: 'number' },
  age: { title: 'Age', format: 'number' },
  phaseName: { title: 'Phase Name', format: 'string' },
  portfolioValue: { title: 'Portfolio Value', format: 'currency' },
  stocksValue: { title: 'Stocks Value', format: 'currency' },
  stocksReturn: { title: 'Stocks Return', format: 'percentage' },
  bondsValue: { title: 'Bonds Value', format: 'currency' },
  bondsReturn: { title: 'Bonds Return', format: 'percentage' },
  cashValue: { title: 'Cash Value', format: 'currency' },
  cashReturn: { title: 'Cash Return', format: 'percentage' },
  inflationRate: { title: 'Inflation Rate', format: 'percentage' },
} as const;

// Type-safe config that ensures all keys match SimulationTableRow
export const SIMULATION_TABLE_CONFIG: Record<keyof SimulationTableRow, { title: string; format: ColumnFormat }> = SIMULATION_COLUMNS;

// Helper to validate simulation data at runtime
export const validateSimulationTableRow = (data: unknown): SimulationTableRow => {
  return simulationTableRowSchema.parse(data);
};

// Helper to validate array of simulation data
export const validateSimulationTableData = (data: unknown[]): SimulationTableRow[] => {
  return data.map(validateSimulationTableRow);
};
