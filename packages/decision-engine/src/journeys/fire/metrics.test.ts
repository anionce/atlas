import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { FireInputValues } from "./types";

const values: FireInputValues = {
  currentAge: 30,
  currentInvestments: 10_000,
  monthlyContribution: 800,
  annualReturnRate: 6,
  monthlyExpenses: 1_500,
};

describe("computeMetrics", () => {
  it("computes the FIRE number from monthly expenses (25x rule)", () => {
    const metrics = computeMetrics(values);
    expect(metrics.fireNumber).toBeCloseTo(1_500 * 12 * 25, 6);
  });

  it("computes a reachable ageAtFire consistent with monthsToFire", () => {
    const metrics = computeMetrics(values);
    expect(metrics.monthsToFire).not.toBeNull();
    expect(metrics.ageAtFire).toBeCloseTo(30 + (metrics.monthsToFire as number) / 12, 6);
  });

  it("leaves monthsToFire and ageAtFire as null when unreachable", () => {
    const metrics = computeMetrics({
      ...values,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
    });
    expect(metrics.monthsToFire).toBeNull();
    expect(metrics.ageAtFire).toBeNull();
  });

  it("defaults currentInvestments to 0 when omitted", () => {
    const withoutInitial = computeMetrics({
      currentAge: 30,
      monthlyContribution: 800,
      annualReturnRate: 6,
      monthlyExpenses: 1_500,
    });
    const withZero = computeMetrics({ ...values, currentInvestments: 0 });
    expect(withoutInitial.monthsToFire).toBe(withZero.monthsToFire);
  });
});
