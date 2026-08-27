import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";
import type { HistoricalBacktestInputValues } from "./types";

const values: HistoricalBacktestInputValues = {
  initialPortfolio: 1_000_000,
  monthlyExpenses: 4_500,
  stockAllocationPct: 80,
  years: 30,
  withdrawalStrategyId: "constantDollar",
};

describe("compareScenarios", () => {
  it("always includes the current plan and a reduced-expenses scenario", () => {
    const { scenarios } = compareScenarios(values);
    expect(scenarios.map((s) => s.id)).toEqual(["current-plan", "reduced-expenses"]);
  });

  it("the reduced-expenses scenario never has a lower success rate than the current plan", () => {
    const { scenarios } = compareScenarios(values);
    const current = scenarios.find((s) => s.id === "current-plan")!;
    const reduced = scenarios.find((s) => s.id === "reduced-expenses")!;
    expect(reduced.metrics.successRatePct).toBeGreaterThanOrEqual(current.metrics.successRatePct);
  });

  it("explains the comparison in human language", () => {
    const { explanation } = compareScenarios(values);
    expect(explanation.length).toBeGreaterThan(0);
  });
});
