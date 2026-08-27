import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";
import type { SavingsRateInputValues } from "./types";

const values: SavingsRateInputValues = {
  monthlyIncome: 2_000,
  monthlyExpenses: 1_500,
  currentInvestments: 10_000,
  annualReturnRate: 6,
};

describe("compareScenarios", () => {
  it("always includes the current plan and a boosted-savings-rate scenario", () => {
    const { scenarios } = compareScenarios(values);
    expect(scenarios.map((s) => s.id)).toEqual(["current-plan", "boosted-savings-rate"]);
  });

  it("the boosted scenario has a higher savings rate and never delays reaching FIRE", () => {
    const { scenarios } = compareScenarios(values);
    const current = scenarios.find((s) => s.id === "current-plan")!;
    const boosted = scenarios.find((s) => s.id === "boosted-savings-rate")!;

    expect(boosted.metrics.savingsRatePct).toBeGreaterThan(current.metrics.savingsRatePct);
    expect(boosted.metrics.monthsToFire).not.toBeNull();
    expect(current.metrics.monthsToFire).not.toBeNull();
    expect(boosted.metrics.monthsToFire as number).toBeLessThanOrEqual(
      current.metrics.monthsToFire as number,
    );
  });

  it("explains when boosting the savings rate makes FIRE reachable at all", () => {
    const unreachable: SavingsRateInputValues = {
      monthlyIncome: 1_500,
      monthlyExpenses: 1_500,
      currentInvestments: 0,
      annualReturnRate: 6,
    };
    const { explanation, scenarios } = compareScenarios(unreachable);
    expect(scenarios[0]?.metrics.monthsToFire).toBeNull();
    expect(explanation.length).toBeGreaterThan(0);
  });

  it("explains the comparison in human language", () => {
    const { explanation } = compareScenarios(values);
    expect(explanation.length).toBeGreaterThan(0);
  });
});
