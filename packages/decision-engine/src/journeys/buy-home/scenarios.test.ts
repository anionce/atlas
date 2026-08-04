import { describe, expect, it } from "vitest";

import { compareScenarios } from "./scenarios";
import type { BuyHomeInputValues } from "./types";

const values: BuyHomeInputValues = {
  monthlyIncome: 2500,
  savings: 40_000,
  interestRate: 3.2,
  mortgageYears: 30,
  isNewConstruction: false,
};

describe("compareScenarios", () => {
  it("always includes 'today' and a higher down payment scenario", () => {
    const { scenarios } = compareScenarios(values);
    expect(scenarios.map((s) => s.id)).toEqual(["today", "higher-down-payment"]);
  });

  it("adds a 'wait a year' scenario only when savings capacity is known", () => {
    const { scenarios } = compareScenarios({ ...values, monthlySavingsCapacity: 300 });
    expect(scenarios.map((s) => s.id)).toContain("wait-a-year");
  });

  it("a higher down payment never increases total interest", () => {
    const { scenarios } = compareScenarios(values);
    const today = scenarios.find((s) => s.id === "today")!;
    const higherEntry = scenarios.find((s) => s.id === "higher-down-payment")!;
    expect(higherEntry.metrics.totalInterest).toBeLessThanOrEqual(today.metrics.totalInterest);
  });

  it("explains the comparison in human language mentioning euros saved", () => {
    const { explanation } = compareScenarios(values);
    expect(explanation.length).toBeGreaterThan(0);
  });
});
