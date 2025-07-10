# Configuration Drawer Implementation Plan

## Overview

Create a new component `foundation-settings.tsx` that will be the content for the Configuration drawer in `your-numbers-content.tsx`. This component will provide advanced settings for the Foundation inputs (Annual Income, Annual Expenses, and Invested Assets) following the style and structure of `global-settings.tsx`.

## Component Structure

### 1. Create new file: `/src/app/dashboard/quick-plan/components/foundation-settings.tsx`

```typescript
"use client";

import { useState } from "react";
import { NumberField } from "@/components/number-field";
import { FormSection } from "@/components/form-section";
```

### 2. Component Layout

The component will have three main sections, each corresponding to a Foundation input:

#### Section 1: Annual Income Configuration

- **Title**: "Annual Income"
- **Fields**:
  - Income Growth Rate (%) - NumberField
    - Default: 3
    - Range: 0-10%
    - Step: 0.1
    - Description: "Expected annual growth rate of your income above inflation (0-10%). This is in addition to the inflation rate set in global settings."

#### Section 2: Annual Expenses Configuration

- **Title**: "Annual Expenses"
- **Fields**:
  - Expense Growth Rate (%) - NumberField
    - Default: 3
    - Range: 0-10%
    - Step: 0.1
    - Description: "Expected annual growth rate of your expenses above inflation (0-10%). This is in addition to the inflation rate set in global settings."
  - Retirement Expenses - NumberField
    - Initial value: Empty string (no default)
    - Placeholder: Dynamic based on Annual Expenses
      - If Annual Expenses is set and valid: Use that value as placeholder
      - If Annual Expenses is not set: Use "$50,000" (same as Annual Expenses default placeholder)
    - Description: "Your expected annual expenses in retirement. Defaults to your current expenses."

#### Section 3: Invested Assets Configuration

- **Title**: "Invested Assets"
- **Fields**:
  - Asset Allocation subsection:
    - Stocks (%) - Default: 70, Range: 0-100
    - Bonds (%) - Default: 30, Range: 0-100
    - Cash (%) - Default: 0, Range: 0-100
    - Validation: Must sum to 100%
    - Error message: "Asset allocation must total 100%" (shown when sum ≠ 100)
    - Description for section: "Your target asset allocation. Must total 100%."
  - Expected Returns subsection:
    - Stock Returns (%) - Default: 10, Range: 0-20
    - Bond Returns (%) - Default: 5, Range: 0-15
    - Cash Returns (%) - Default: 3, Range: 0-10
    - Step: 0.1 for all
    - Description: "Expected annual returns for each asset class before inflation."
  - Note at bottom: "Cash allocation also serves as emergency fund."

### 3. State Management & Placeholder Handling

#### Props Interface

```typescript
interface FoundationSettingsProps {
  annualExpenses?: string; // Current value from Foundation inputs
}
```

#### Placeholder Logic for Retirement Expenses

```typescript
// Utility to extract numeric value from currency string
const extractNumericValue = (value: string): string => {
  const match = value.match(/[\d,]+\.?\d*/);
  return match ? match[0].replace(/,/g, "") : "";
};

// Check if a currency value is valid
const isValidCurrency = (value?: string): boolean => {
  if (!value) return false;
  const numericValue = extractNumericValue(value);
  return numericValue !== "" && !isNaN(parseFloat(numericValue));
};

// State for Retirement Expenses - always starts empty
const [retirementExpenses, setRetirementExpenses] = useState("");

// Dynamic placeholder
const retirementExpensesPlaceholder = isValidCurrency(props.annualExpenses)
  ? props.annualExpenses
  : "$50,000";
```

#### State for All Other Fields

```typescript
// Growth rates
const [incomeGrowthRate, setIncomeGrowthRate] = useState("3");
const [expenseGrowthRate, setExpenseGrowthRate] = useState("3");

// Asset allocation
const [stockAllocation, setStockAllocation] = useState("70");
const [bondAllocation, setBondAllocation] = useState("30");
const [cashAllocation, setCashAllocation] = useState("0");

// Expected returns
const [stockReturn, setStockReturn] = useState("10");
const [bondReturn, setBondReturn] = useState("5");
const [cashReturn, setCashReturn] = useState("3");
```

### 4. Integration with your-numbers-content.tsx

```tsx
// Import the new component
import { FoundationSettings } from "./foundation-settings";

// Pass only the needed Foundation value
<Drawer
  open={advancedOpen}
  setOpen={setAdvancedOpen}
  title="Configuration"
  desc="Fine-tune how your Foundation numbers are used in projections."
>
  <FoundationSettings annualExpenses={annualExpenses} />
</Drawer>;
```

## Key Implementation Details

1. **Consistent Placeholder Behavior**: Retirement Expenses follows the same pattern as Foundation inputs - shows placeholder, not initial value

2. **Dynamic Placeholder**:
   - Shows Annual Expenses value as placeholder when available
   - Falls back to "$50,000" when Annual Expenses is not set
   - Field always starts empty, user must explicitly enter a value

3. **No Disabled States**: All settings remain enabled regardless of Foundation input values

4. **Immediate Effect**: No Save/Cancel buttons - changes take effect immediately (global state wiring is future work)

5. **Updated Default Returns**: Using nominal (before inflation) values:
   - Stocks: 10% (historical average)
   - Bonds: 5% (historical average)
   - Cash: 3% (aligns with typical inflation)

6. **Clear Descriptions**: Each field explains its relationship to inflation and global settings

7. **Validation**: Real-time validation for asset allocation sum

## Validation Functions

```typescript
// Utility to check if asset allocation sums to 100
const isAllocationValid = (
  stocks: string,
  bonds: string,
  cash: string
): boolean => {
  const sum =
    parseFloat(stocks || "0") +
    parseFloat(bonds || "0") +
    parseFloat(cash || "0");
  return Math.abs(sum - 100) < 0.01; // Account for floating point precision
};

// Show validation error message
const showAllocationError = !isAllocationValid(
  stockAllocation,
  bondAllocation,
  cashAllocation
);
```

## Component Structure Following global-settings.tsx Pattern

- Use FormSection for each major section
- Last FormSection should have `hasBorder={false}`
- Consistent spacing and styling with existing drawer content
- Clear, helpful descriptions for each field

## Files to Create

- `/src/app/dashboard/quick-plan/components/foundation-settings.tsx`

## Files to Update

- `/src/app/dashboard/quick-plan/components/your-numbers-content.tsx`
  - Import FoundationSettings component
  - Pass annualExpenses prop
  - Replace TODO comment with component

## Note on State Management

This implementation uses local state within the component. Future work will involve:

- Connecting to global state management
- Persisting settings across sessions
- Real-time updates to calculations based on setting changes

These aspects are explicitly out of scope for the current implementation.
