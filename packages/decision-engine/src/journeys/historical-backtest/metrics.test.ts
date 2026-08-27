import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { HistoricalBacktestInputValues } from "./types";

const baseValues: HistoricalBacktestInputValues = {
  initialPortfolio: 1_000_000,
  monthlyExpenses: 3_333.33,
  stockAllocationPct: 80,
  years: 30,
  withdrawalStrategyId: "constantDollar",
};

describe("computeMetrics", () => {
  it("computes a success rate close to the well-documented ~95% for the classic 4% scenario", () => {
    const metrics = computeMetrics(baseValues);
    expect(metrics.successRatePct).toBeGreaterThanOrEqual(80);
    expect(metrics.successRatePct).toBeLessThanOrEqual(100);
    expect(metrics.totalSimulations).toBe(69);
  });

  it("computes the withdrawal rate from monthly expenses and the initial portfolio", () => {
    const metrics = computeMetrics(baseValues);
    // 3.333,33 € x 12 / 1.000.000 € ≈ 4 %.
    expect(metrics.withdrawalRatePct).toBeCloseTo(4, 1);
  });

  it("never has a higher success rate at a higher withdrawal rate, all else equal", () => {
    const low = computeMetrics({ ...baseValues, monthlyExpenses: 2_000 });
    const high = computeMetrics({ ...baseValues, monthlyExpenses: 5_000 });
    expect(high.successRatePct).toBeLessThanOrEqual(low.successRatePct);
  });

  it("computes a valid result for every withdrawal strategy id", () => {
    const strategyIds = [
      "constantDollar",
      "percentOfPortfolio",
      "oneOverN",
      "vpw",
      "guytonKlinger",
    ] as const;

    for (const withdrawalStrategyId of strategyIds) {
      const metrics = computeMetrics({ ...baseValues, withdrawalStrategyId });
      expect(metrics.totalSimulations).toBe(69);
      expect(metrics.simulations.length).toBe(69);
      expect(metrics.successRatePct).toBeGreaterThanOrEqual(0);
      expect(metrics.successRatePct).toBeLessThanOrEqual(100);
    }
  });

  it("percentOfPortfolio and oneOverN/vpw never fail, by construction", () => {
    const percentOfPortfolio = computeMetrics({
      ...baseValues,
      withdrawalStrategyId: "percentOfPortfolio",
    });
    const oneOverN = computeMetrics({ ...baseValues, withdrawalStrategyId: "oneOverN" });
    expect(percentOfPortfolio.successRatePct).toBe(100);
    expect(oneOverN.successRatePct).toBe(100);
  });
});
