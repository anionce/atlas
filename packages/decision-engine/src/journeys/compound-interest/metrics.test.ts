import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { CompoundInterestInputValues } from "./types";

const values: CompoundInterestInputValues = {
  initialAmount: 1_000,
  monthlyContribution: 200,
  annualReturnRate: 6,
  years: 15,
};

describe("computeMetrics", () => {
  it("produces internally consistent metrics", () => {
    const metrics = computeMetrics(values);
    expect(metrics.finalBalance).toBeCloseTo(
      metrics.totalContributed + metrics.totalInterestEarned,
      6,
    );
    expect(metrics.totalContributed).toBeCloseTo(1_000 + 200 * 15 * 12, 6);
  });

  it("leaves monthsToGoal as null when no goal was given", () => {
    expect(computeMetrics(values).monthsToGoal).toBeNull();
  });

  it("computes monthsToGoal when a goal is given", () => {
    const metrics = computeMetrics({ ...values, goalAmount: 20_000 });
    expect(metrics.monthsToGoal).not.toBeNull();
    expect(metrics.monthsToGoal as number).toBeGreaterThan(0);
  });

  it("defaults initialAmount to 0 when omitted", () => {
    const withoutInitial = computeMetrics({
      monthlyContribution: 200,
      annualReturnRate: 6,
      years: 15,
    });
    const withZeroInitial = computeMetrics({ ...values, initialAmount: 0 });
    expect(withoutInitial.finalBalance).toBeCloseTo(withZeroInitial.finalBalance, 6);
  });
});
