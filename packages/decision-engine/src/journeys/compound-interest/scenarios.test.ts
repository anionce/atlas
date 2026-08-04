import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";
import type { CompoundInterestInputValues } from "./types";

const values: CompoundInterestInputValues = {
  monthlyContribution: 200,
  annualReturnRate: 6,
  years: 15,
};

describe("compareScenarios", () => {
  it("always includes the current plan and an extra-contribution scenario", () => {
    const { scenarios } = compareScenarios(values);
    expect(scenarios.map((s) => s.id)).toEqual(["current-plan", "extra-contribution"]);
  });

  it("contributing more never results in a lower final balance", () => {
    const { scenarios } = compareScenarios(values);
    const current = scenarios.find((s) => s.id === "current-plan")!;
    const extra = scenarios.find((s) => s.id === "extra-contribution")!;
    expect(extra.metrics.finalBalance).toBeGreaterThan(current.metrics.finalBalance);
  });

  it("explains the comparison in human language", () => {
    const { explanation } = compareScenarios(values);
    expect(explanation.length).toBeGreaterThan(0);
  });
});
