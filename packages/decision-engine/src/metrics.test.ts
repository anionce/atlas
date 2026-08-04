import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { BuyHomeInputValues } from "./types";

const values: BuyHomeInputValues = {
  monthlyIncome: 2500,
  savings: 40_000,
  interestRate: 3.2,
  mortgageYears: 30,
  isNewConstruction: false,
};

describe("computeMetrics", () => {
  it("produces non-negative, internally consistent metrics", () => {
    const metrics = computeMetrics(values);
    expect(metrics.maxPropertyPrice).toBeGreaterThan(0);
    expect(metrics.requiredEntry).toBeGreaterThan(0);
    expect(metrics.monthlyPayment).toBeGreaterThan(0);
    expect(metrics.totalInterest).toBeGreaterThanOrEqual(0);
    expect(metrics.purchaseCosts).toBeGreaterThan(0);
    expect(metrics.requiredEntry).toBeLessThan(metrics.maxPropertyPrice);
  });

  it("charges IVA instead of ITP for new construction, raising purchase costs", () => {
    const resale = computeMetrics({ ...values, isNewConstruction: false });
    const newBuild = computeMetrics({ ...values, isNewConstruction: true });
    expect(newBuild.purchaseCosts).toBeGreaterThan(resale.purchaseCosts);
  });
});
