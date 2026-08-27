import { describe, expect, it } from "vitest";

import { calculateSavingsRate } from "./savings-rate";

describe("calculateSavingsRate", () => {
  it("computes the savings rate as a percentage of income", () => {
    const result = calculateSavingsRate({ monthlyIncome: 2_000, monthlyExpenses: 1_500 });
    expect(result.monthlySavings).toBe(500);
    expect(result.savingsRatePct).toBeCloseTo(25, 6);
  });

  it("returns 0% when income and expenses are equal", () => {
    const result = calculateSavingsRate({ monthlyIncome: 2_000, monthlyExpenses: 2_000 });
    expect(result.monthlySavings).toBe(0);
    expect(result.savingsRatePct).toBe(0);
  });

  it("returns a negative rate when expenses exceed income", () => {
    const result = calculateSavingsRate({ monthlyIncome: 2_000, monthlyExpenses: 2_500 });
    expect(result.monthlySavings).toBe(-500);
    expect(result.savingsRatePct).toBeCloseTo(-25, 6);
  });

  it("returns 0% rate when income is not positive, without dividing by zero", () => {
    const result = calculateSavingsRate({ monthlyIncome: 0, monthlyExpenses: 500 });
    expect(result.savingsRatePct).toBe(0);
  });

  it("returns 100% when expenses are zero", () => {
    const result = calculateSavingsRate({ monthlyIncome: 2_000, monthlyExpenses: 0 });
    expect(result.savingsRatePct).toBeCloseTo(100, 6);
  });
});
