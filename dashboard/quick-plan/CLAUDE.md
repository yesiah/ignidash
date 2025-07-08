# Quick Plan FIRE Calculator Implementation Guide

## Overview

Quick Plan is the core FIRE calculator feature that provides instant projections for Traditional FIRE, Coast FIRE, and Barista FIRE paths. It emphasizes simplicity and progressive disclosure while offering powerful modeling capabilities for one-time events and advanced settings.

## Core Design Philosophy

- **4-field minimal experience** - Most users can complete in 30 seconds
- **Progressive disclosure** - Advanced options hidden but easily accessible
- **Educational focus** - Clear disclaimers, no personalized investment advice
- **Mobile-first** - Touch-friendly inputs and responsive design
- **Shareable results** - Reddit-optimized for viral growth

## Input Structure

### Core Inputs (Always Visible)

#### 1. Current Age

- **Type**: Number input
- **Range**: 18-100
- **Validation**: Required, must be valid integer
- **UI**: Standard number input with stepper buttons

#### 2. Annual Income (After-Tax)

- **Type**: Currency input
- **Validation**: Required, must be positive
- **UI**: Currency formatting with $ prefix
- **Progressive Disclosure**:
  - "Income growth rate" (collapsible)
  - **Default**: 3% annually
  - **Range**: 0-10%

#### 3. Annual Expenses (Current)

- **Type**: Currency input
- **Validation**: Required, must be positive, should be ≤ income
- **UI**: Currency formatting with $ prefix
- **Progressive Disclosure**:
  - "Expense growth rate" (collapsible)
    - **Default**: 3% annually
    - **Range**: 0-10%
  - "Retirement expenses" (collapsible)
    - **Default**: Same as current expenses
    - **UI**: Currency input or percentage of current expenses

#### 4. Current Net Worth (Invested Assets)

- **Type**: Currency input
- **Validation**: Required, must be non-negative
- **UI**: Currency formatting with $ prefix
- **Progressive Disclosure**:
  - "Asset allocation & expected returns" (collapsible)
  - **Stocks**: Default 70%, Expected return 7%
  - **Bonds**: Default 30%, Expected return 4%
  - **Cash**: Default 0%, Expected return 1%
  - **UI Note**: "Cash allocation also serves as emergency fund"

### FIRE Path Specific Inputs

These inputs appear contextually based on selected FIRE path:

#### Coast FIRE Additional Input

- **Target Full Retirement Age**
- **Type**: Number input
- **Range**: Current age + 10 to 100
- **Purpose**: When you want to fully retire (not coast age)

#### Barista FIRE Additional Input

- **Expected Side Income**
- **Type**: Currency input
- **Validation**: Must be positive, typically < current income
- **Purpose**: Annual income during Barista FIRE phase

### One-Time Events (Limit 3 Total)

Users can add up to 3 events total, mixing and matching:

#### Event Types

1. **Windfalls**
   - Amount (currency)
   - Year (current age + 1 to life expectancy)
   - Examples: Inheritance, bonus, stock options

2. **Major Purchases**
   - Amount (currency)
   - Year (current age + 1 to life expectancy)
   - Examples: House down payment, wedding, emergency

3. **Life Changes**
   - Amount per year (currency)
   - Start year (current age + 1 to life expectancy)
   - End year (must be > start year)
   - Examples: Kids, eldercare, education

4. **Career Breaks**
   - Income reduction amount (currency per year)
   - Start year (current age + 1 to life expectancy)
   - End year (must be > start year)
   - Examples: Sabbatical, parental leave, career change transition

#### UI Implementation

- **Add Event** button (disabled when 3 events exist)
- **Event Cards** showing type, amount, timing
- **Delete** button for each event
- **Event Counter** showing "2 of 3 events used"

## UI Layout & Settings

### Header Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Your Numbers                                 [⚙️ Settings] │
└─────────────────────────────────────────────────────────────┘
```

### Settings Dialog/Drawer

Triggered by cog icon, contains global calculation settings:

#### Settings Options

- **Safe Withdrawal Rate**
  - 4% Rule (default)
  - 3.5% Conservative
  - 3.25% Very Conservative
  - Custom percentage (2-6%)

- **Inflation Rate**
  - Default: 3%
  - Range: 0-8%
  - Used for real return calculations

- **Life Expectancy**
  - Default: 85
  - Range: 70-110
  - Used for Coast FIRE calculations

- **Display Format**
  - Today's Dollars (default)
  - Future Inflated Dollars

#### Settings UI

- **Modal on desktop**, drawer on mobile
- **Save/Cancel** buttons
- **Reset to Defaults** option
- Settings persist in localStorage

## Technical Implementation

### State Management

```typescript
interface QuickPlanState {
  // Core inputs
  currentAge: number;
  annualIncome: number;
  annualExpenses: number;
  currentNetWorth: number;

  // Growth rates (progressive disclosure)
  incomeGrowthRate: number; // default 3%
  expenseGrowthRate: number; // default 3%
  retirementExpenses?: number; // optional override

  // Asset allocation (progressive disclosure)
  stockAllocation: number; // default 70%
  bondAllocation: number; // default 30%
  cashAllocation: number; // default 0%
  stockReturn: number; // default 7%
  bondReturn: number; // default 4%
  cashReturn: number; // default 1%

  // FIRE path specific
  firePath: "traditional" | "coast" | "barista";
  targetRetirementAge?: number; // Coast FIRE only
  baristaSideIncome?: number; // Barista FIRE only

  // One-time events
  events: Event[]; // max 3

  // Settings
  safeWithdrawalRate: number; // default 4%
  inflationRate: number; // default 3%
  lifeExpectancy: number; // default 85
  displayFormat: "today" | "future"; // default 'today'
}

interface Event {
  id: string;
  type: "windfall" | "majorPurchase" | "lifeChange" | "careerBreak";
  amount: number;
  year: number;
  endYear?: number; // only for lifeChange and careerBreak
}
```

### Validation Rules

- **Real-time validation** with debounced calculations
- **Income > Expenses** warning (not blocking)
- **Asset allocation must sum to 100%**
- **Event years must be realistic** (current age + 1 to life expectancy)
- **Positive values** for all monetary inputs
- **Age ranges** enforced for all age-related inputs

### Performance Considerations

- **Debounce calculations** by 300ms on input change
- **Memoize expensive calculations** using React.useMemo
- **Virtual scrolling** for long event lists (if needed)
- **Progressive enhancement** - basic calculations work without JS

### Data Persistence

- **localStorage** for return visits
- **URL parameters** for sharing (base64 encoded state)
- **No server storage** - privacy-first approach

## Calculations & Outputs

### Core Calculations

#### Traditional FIRE

```
FIRE Number = Annual Expenses / Safe Withdrawal Rate
Years to FIRE = Time to reach FIRE Number given:
  - Current net worth
  - Monthly savings (income - expenses)
  - Expected portfolio return
  - One-time events
```

#### Coast FIRE

```
Required Coast Amount = FIRE Number / (1 + return)^years_to_retirement
Current Coast Status = Current Net Worth >= Required Coast Amount
Years to Coast = Time to reach Required Coast Amount
```

#### Barista FIRE

```
Barista FIRE Number = (Annual Expenses - Side Income) / Safe Withdrawal Rate
Years to Barista FIRE = Time to reach Barista FIRE Number
```

### Output Visualizations

- **Portfolio growth chart** showing path to FIRE
- **Multiple scenario comparison** (if multiple paths selected)
- **Sensitivity analysis** for key variables
- **Event impact visualization** showing effect of one-time events

## Legal Compliance

### Required Disclaimers

All disclaimers must be prominent and clearly visible:

#### Primary Disclaimer (Above Results)

```
"This calculator is for educational purposes only and does not constitute
personalized financial advice. Results are hypothetical projections based
on your inputs and assumptions. Consult a licensed financial advisor for
personalized advice."
```

#### Secondary Disclaimers

- **Investment Returns**: "Past performance does not guarantee future results"
- **Inflation**: "Inflation estimates are assumptions and may vary significantly"
- **Life Expectancy**: "Life expectancy is an estimate and individual results may vary"

### Prohibited Content

- **No specific fund recommendations** (no "invest in VTSAX")
- **No portfolio allocation advice** (no "you should allocate 70% to stocks")
- **No personalized strategies** (no "you should retire at 45")
- **No guarantee language** (no "you will retire in X years")

### Compliant Language Examples

- ✅ "Based on your inputs, you might reach FIRE in..."
- ✅ "This projection assumes..."
- ✅ "Consider various scenarios..."
- ❌ "You should invest in..."
- ❌ "We recommend..."
- ❌ "You will retire in..."

## User Experience Guidelines

### Progressive Disclosure Implementation

- **Collapsible sections** with clear expand/collapse indicators
- **Sensible defaults** that work for most users
- **Contextual help** tooltips for complex concepts
- **Visual hierarchy** to guide user attention

### Mobile Optimization

- **Touch-friendly** input controls (minimum 44px tap targets)
- **Responsive charts** that work on small screens
- **Simplified mobile layout** with stacked sections
- **Swipe gestures** for navigating between FIRE paths

### Accessibility

- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** mode compatibility
- **Focus indicators** for all interactive elements

### Error Handling

- **Inline validation** with clear error messages
- **Graceful degradation** when calculations fail
- **Helpful suggestions** for fixing input errors
- **Loading states** during calculations

### Shareability Features

- **Generate shareable URL** with encoded state
- **Social media optimized** preview cards
- **Export to PDF** functionality
- **Reddit-friendly** formatting for results

## Performance Targets

- **Initial load**: < 2 seconds
- **Calculation updates**: < 100ms
- **Settings dialog**: < 200ms to open
- **Mobile responsiveness**: Works on iOS Safari and Android Chrome

## Future Enhancements (Not MVP)

- **Multiple plan comparison** (paid feature)
- **Monte Carlo simulations** for success probability
- **Tax-advantaged account modeling**
- **International currency support**
- **Advanced withdrawal strategies**
- **Detailed breakdown exports**

## Implementation Priority

1. **Core inputs** with basic calculations
2. **Progressive disclosure** for advanced options
3. **Settings dialog** with global options
4. **One-time events** functionality
5. **Visualizations** and charts
6. **Shareability** features
7. **Mobile optimization**
8. **Legal compliance** review
