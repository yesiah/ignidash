// import { describe, it, expect } from 'vitest';
// import { calculateYearsToFIRE, calculateFIREAge, getFIREAnalysis } from './fire-analysis';
// import { calculateFuturePortfolioValue, calculateWeightedPortfolioReturnReal } from './portfolio-calculations';
// import { QuickPlanInputs } from '../schemas/quick-plan-schema';

// describe('FIRE Calculations - Additional Validation', () => {
//   // 1. Cross-reference with known FIRE calculators
//   describe('Cross-validation with External Calculators', () => {
//     it('should match FIREcalc.com basic scenario', () => {
//       // FIREcalc.com example: $100k start, $40k/year savings, 7% return, 3% inflation
//       // Expected result: ~14-15 years to reach $1M
//       const firecalcInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 100000,
//           annualExpenses: 60000,
//           investedAssets: 100000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3, // Matching inflation
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 100, // Simplified to 100% stocks
//           bondAllocation: 0,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 7, // Common assumption
//           bondReturn: 4,
//           cashReturn: 2,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       const years = calculateYearsToFIRE(firecalcInputs);
//       // With 4% real return (7% - 3%), should be around 16-17 years
//       expect(years).toBeGreaterThanOrEqual(15);
//       expect(years).toBeLessThanOrEqual(18);
//     });

//     it('should match PersonalCapital retirement planner scenario', () => {
//       // Personal Capital typically uses Monte Carlo, but median case should be similar
//       const pcInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 35,
//           annualIncome: 120000,
//           annualExpenses: 70000,
//           investedAssets: 200000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 80,
//           bondAllocation: 20,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 50000,
//         },
//         marketAssumptions: {
//           stockReturn: 9,
//           bondReturn: 4,
//           cashReturn: 2,
//           inflationRate: 2.5,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 90,
//           effectiveTaxRate: 20,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 55,
//           partTimeIncome: 0,
//         },
//       };

//       const analysis = getFIREAnalysis(pcInputs);
//       // $50k expenses / 4% = $1.25M needed
//       expect(analysis.requiredPortfolio).toBe(1250000);
//       // With $50k/year savings and good returns, should be 11-14 years
//       expect(analysis.yearsToFIRE).toBeGreaterThanOrEqual(10);
//       expect(analysis.yearsToFIRE).toBeLessThanOrEqual(15);
//     });
//   });

//   // 2. Mathematical identity checks
//   describe('Mathematical Identity Verification', () => {
//     it('should satisfy the compound interest equation', () => {
//       const inputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 80000,
//           annualExpenses: 50000,
//           investedAssets: 50000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 70,
//           bondAllocation: 30,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 10,
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       const years = calculateYearsToFIRE(inputs);
//       const futureValue = calculateFuturePortfolioValue(inputs, years, false);
//       const requiredPortfolio = 40000 / 0.04;

//       // The portfolio value at FIRE should be >= required (within rounding)
//       expect(futureValue).toBeGreaterThanOrEqual(requiredPortfolio);

//       // But year before should be less
//       if (years > 0) {
//         const yearBefore = calculateFuturePortfolioValue(inputs, years - 1, false);
//         expect(yearBefore).toBeLessThan(requiredPortfolio);
//       }
//     });

//     it('should follow the future value of annuity formula', () => {
//       // FV = PMT × [(1+r)^n - 1] / r
//       const annualSavings = 30000;
//       const years = 10;

//       // Our calculation (starting with 0 assets)
//       const inputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 80000,
//           annualExpenses: 50000, // 30k savings
//           investedAssets: 0, // Start with nothing
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3, // Both match inflation = 0% real growth
//         },
//         allocation: {
//           stockAllocation: 100,
//           bondAllocation: 0,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 8,
//           bondReturn: 4,
//           cashReturn: 2,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       // Calculate the actual real return from our inputs
//       const realReturn = calculateWeightedPortfolioReturnReal(inputs.allocation, inputs.marketAssumptions) / 100;

//       // Manual calculation with the correct real return
//       const fvAnnuity = annualSavings * ((Math.pow(1 + realReturn, years) - 1) / realReturn);

//       const portfolioValue = calculateFuturePortfolioValue(inputs, years, false);

//       // Should match within floating point precision
//       expect(portfolioValue).toBeCloseTo(fvAnnuity, 2);
//     });
//   });

//   // 3. Boundary and stress tests
//   describe('Boundary and Stress Tests', () => {
//     it('should handle extreme market returns correctly', () => {
//       const extremeInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 100000,
//           annualExpenses: 60000,
//           investedAssets: 100000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 100,
//           bondAllocation: 0,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 20, // Very high return
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       const years = calculateYearsToFIRE(extremeInputs);
//       // With 16.5% real return (20% - 3% inflation adjusted), should be about 9 years
//       expect(years).toBe(9);
//       expect(years).toBeGreaterThan(0);
//     });

//     it('should handle zero return scenario', () => {
//       const zeroReturnInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 100000,
//           annualExpenses: 60000,
//           investedAssets: 100000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 0,
//           bondAllocation: 0,
//           cashAllocation: 100,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 10,
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3, // Cash return = inflation = 0% real
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       const years = calculateYearsToFIRE(zeroReturnInputs);
//       // Need $1M, have $100k, save $40k/year with 0% growth
//       // Should take exactly (1000000 - 100000) / 40000 = 22.5 years
//       expect(years).toBe(23); // Rounds up
//     });
//   });

//   // 4. Consistency checks
//   describe('Internal Consistency Verification', () => {
//     it('should be consistent when run multiple times', () => {
//       const inputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 40,
//           annualIncome: 150000,
//           annualExpenses: 80000,
//           investedAssets: 300000,
//         },
//         growthRates: {
//           incomeGrowthRate: 4,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 60,
//           bondAllocation: 30,
//           cashAllocation: 10,
//         },
//         goals: {
//           retirementExpenses: 60000,
//         },
//         marketAssumptions: {
//           stockReturn: 9,
//           bondReturn: 4,
//           cashReturn: 2,
//           inflationRate: 2.5,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 3.5,
//           retirementIncome: 0,
//           lifeExpectancy: 90,
//           effectiveTaxRate: 20,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 55,
//           partTimeIncome: 0,
//         },
//       };

//       // Run multiple times
//       const results = [];
//       for (let i = 0; i < 5; i++) {
//         results.push(calculateYearsToFIRE(inputs));
//       }

//       // All results should be identical
//       expect(new Set(results).size).toBe(1);
//     });

//     it('should show monotonic behavior with savings rate', () => {
//       const baseInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 100000,
//           annualExpenses: 70000, // Base: $30k savings
//           investedAssets: 50000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 70,
//           bondAllocation: 30,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 10,
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 85,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 50,
//           partTimeIncome: 0,
//         },
//       };

//       // Test with increasing savings rates
//       const savingsRates = [20000, 30000, 40000, 50000, 60000];
//       const results = savingsRates.map((savings) => {
//         const inputs = {
//           ...baseInputs,
//           basics: {
//             ...baseInputs.basics,
//             annualExpenses: 100000 - savings,
//           },
//         };
//         return calculateYearsToFIRE(inputs);
//       });

//       // Years to FIRE should decrease as savings increase
//       for (let i = 1; i < results.length; i++) {
//         expect(results[i]).toBeLessThanOrEqual(results[i - 1]);
//       }
//     });
//   });

//   // 5. Known edge cases from financial planning
//   describe('Known Financial Planning Scenarios', () => {
//     it("should handle the 'Coast FIRE' scenario", () => {
//       // Coast FIRE: Current assets will grow to FIRE amount without more contributions
//       const coastInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 30,
//           annualIncome: 60000,
//           annualExpenses: 60000, // Zero savings
//           investedAssets: 250000, // Good start
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 80,
//           bondAllocation: 20,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 40000,
//         },
//         marketAssumptions: {
//           stockReturn: 10,
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 90,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 65,
//           partTimeIncome: 0,
//         },
//       };

//       const years = calculateYearsToFIRE(coastInputs);
//       // $250k growing at ~5.9% real to reach $1M
//       // ln(4) / ln(1.059) ≈ 24 years
//       expect(years).toBeGreaterThan(20);
//       expect(years).toBeLessThan(30);
//     });

//     it("should handle the 'Barista FIRE' scenario", () => {
//       // Barista FIRE: Lower FIRE target due to part-time income
//       const baristaInputs: QuickPlanInputs = {
//         basics: {
//           currentAge: 35,
//           annualIncome: 80000,
//           annualExpenses: 50000,
//           investedAssets: 200000,
//         },
//         growthRates: {
//           incomeGrowthRate: 3,
//           expenseGrowthRate: 3,
//         },
//         allocation: {
//           stockAllocation: 70,
//           bondAllocation: 30,
//           cashAllocation: 0,
//         },
//         goals: {
//           retirementExpenses: 25000, // Lower due to $15k part-time income
//         },
//         marketAssumptions: {
//           stockReturn: 10,
//           bondReturn: 5,
//           cashReturn: 3,
//           inflationRate: 3,
//         },
//         retirementFunding: {
//           safeWithdrawalRate: 4,
//           retirementIncome: 0,
//           lifeExpectancy: 90,
//           effectiveTaxRate: 15,
//         },
//         flexiblePaths: {
//           targetRetirementAge: 45,
//           partTimeIncome: 15000,
//         },
//       };

//       const analysis = getFIREAnalysis(baristaInputs);
//       // Need only $625k instead of $1M
//       expect(analysis.requiredPortfolio).toBe(625000);
//       expect(analysis.yearsToFIRE).toBeLessThan(10);
//     });
//   });
// });

// // 6. Property-based testing concepts
// describe('Property-Based Validation', () => {
//   it('should always reach FIRE faster with higher returns', () => {
//     const baseInputs: QuickPlanInputs = {
//       basics: {
//         currentAge: 30,
//         annualIncome: 100000,
//         annualExpenses: 60000,
//         investedAssets: 100000,
//       },
//       growthRates: {
//         incomeGrowthRate: 3,
//         expenseGrowthRate: 3,
//       },
//       allocation: {
//         stockAllocation: 100,
//         bondAllocation: 0,
//         cashAllocation: 0,
//       },
//       goals: {
//         retirementExpenses: 40000,
//       },
//       marketAssumptions: {
//         stockReturn: 8,
//         bondReturn: 4,
//         cashReturn: 2,
//         inflationRate: 3,
//       },
//       retirementFunding: {
//         safeWithdrawalRate: 4,
//         retirementIncome: 0,
//         lifeExpectancy: 85,
//         effectiveTaxRate: 15,
//       },
//       flexiblePaths: {
//         targetRetirementAge: 50,
//         partTimeIncome: 0,
//       },
//     };

//     const lowReturnYears = calculateYearsToFIRE(baseInputs);

//     const highReturnInputs = {
//       ...baseInputs,
//       marketAssumptions: {
//         ...baseInputs.marketAssumptions,
//         stockReturn: 12, // Higher return
//       },
//     };

//     const highReturnYears = calculateYearsToFIRE(highReturnInputs);

//     expect(highReturnYears).toBeLessThan(lowReturnYears);
//   });

//   it('should never achieve FIRE if withdrawal > growth + savings', () => {
//     const impossibleInputs: QuickPlanInputs = {
//       basics: {
//         currentAge: 30,
//         annualIncome: 50000,
//         annualExpenses: 80000, // Negative $30k/year
//         investedAssets: 100000,
//       },
//       growthRates: {
//         incomeGrowthRate: 2,
//         expenseGrowthRate: 4, // Expenses growing faster
//       },
//       allocation: {
//         stockAllocation: 50,
//         bondAllocation: 50,
//         cashAllocation: 0,
//       },
//       goals: {
//         retirementExpenses: 40000,
//       },
//       marketAssumptions: {
//         stockReturn: 6,
//         bondReturn: 3,
//         cashReturn: 1,
//         inflationRate: 3,
//       },
//       retirementFunding: {
//         safeWithdrawalRate: 4,
//         retirementIncome: 0,
//         lifeExpectancy: 90,
//         effectiveTaxRate: 15,
//       },
//       flexiblePaths: {
//         targetRetirementAge: 65,
//         partTimeIncome: 0,
//       },
//     };

//     const years = calculateYearsToFIRE(impossibleInputs);
//     expect(years).toBe(-1);
//   });
// });
