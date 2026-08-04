import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";
import type { FireInputValues } from "./types";

const values: FireInputValues = {
  currentAge: 30,
  currentInvestments: 10_000,
  monthlyContribution: 500,
  annualReturnRate: 6,
  monthlyExpenses: 1_500,
};

describe("compareScenarios", () => {
  it("always includes the current plan and an extra-contribution scenario", () => {
    const { scenarios } = compareScenarios(values);
    expect(scenarios.map((s) => s.id)).toEqual(["current-plan", "extra-contribution"]);
  });

  it("contributing more never delays reaching FIRE", () => {
    const { scenarios } = compareScenarios(values);
    const current = scenarios.find((s) => s.id === "current-plan")!;
    const extra = scenarios.find((s) => s.id === "extra-contribution")!;
    expect(extra.metrics.monthsToFire).not.toBeNull();
    expect(current.metrics.monthsToFire).not.toBeNull();
    expect(extra.metrics.monthsToFire as number).toBeLessThanOrEqual(
      current.metrics.monthsToFire as number,
    );
  });

  it("explains when extra contribution makes FIRE reachable at all", () => {
    const unreachable: FireInputValues = {
      currentAge: 30,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
      monthlyExpenses: 1_500,
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
