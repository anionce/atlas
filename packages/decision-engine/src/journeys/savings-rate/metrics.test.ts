import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { SavingsRateInputValues } from "./types";

const values: SavingsRateInputValues = {
  monthlyIncome: 2_000,
  monthlyExpenses: 1_500,
  currentInvestments: 10_000,
  annualReturnRate: 6,
};

describe("computeMetrics", () => {
  it("computes monthly savings and the savings rate", () => {
    const metrics = computeMetrics(values);
    expect(metrics.monthlySavings).toBe(500);
    expect(metrics.savingsRatePct).toBeCloseTo(25, 6);
  });

  it("computes the FIRE number from monthly expenses (25x rule)", () => {
    const metrics = computeMetrics(values);
    expect(metrics.fireNumber).toBeCloseTo(1_500 * 12 * 25, 6);
  });

  it("computes a reachable monthsToFire when the savings rate is positive", () => {
    const metrics = computeMetrics(values);
    expect(metrics.monthsToFire).not.toBeNull();
  });

  it("leaves monthsToFire as null when expenses match or exceed income", () => {
    const metrics = computeMetrics({ ...values, monthlyExpenses: 2_000, currentInvestments: 0 });
    expect(metrics.monthlySavings).toBe(0);
    expect(metrics.monthsToFire).toBeNull();
  });

  it("defaults currentInvestments to 0 when omitted", () => {
    const withoutInitial = computeMetrics({
      monthlyIncome: 2_000,
      monthlyExpenses: 1_500,
      annualReturnRate: 6,
    });
    const withZero = computeMetrics({ ...values, currentInvestments: 0 });
    expect(withoutInitial.monthsToFire).toBe(withZero.monthsToFire);
  });
});
