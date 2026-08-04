import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";
import type { CompoundInterestInputValues, CompoundInterestMetrics } from "./types";

const values: CompoundInterestInputValues = {
  monthlyContribution: 200,
  annualReturnRate: 6,
  years: 15,
};

const metrics: CompoundInterestMetrics = {
  finalBalance: 50_000,
  totalContributed: 36_000,
  totalInterestEarned: 14_000,
  monthsToGoal: null,
};

describe("generateInsights", () => {
  it("does not evaluate the goal rule when no goal was given", () => {
    const insights = generateInsights(values, metrics);
    expect(insights.some((i) => i.code === "goal_reached" || i.code === "goal_not_reached")).toBe(
      false,
    );
  });

  it("reports goal_reached when the final balance meets the goal", () => {
    const insights = generateInsights({ ...values, goalAmount: 40_000 }, metrics);
    expect(insights.some((i) => i.code === "goal_reached")).toBe(true);
  });

  it("reports goal_not_reached as a warning when the goal falls short", () => {
    const insights = generateInsights({ ...values, goalAmount: 100_000 }, metrics);
    const warning = insights.find((i) => i.code === "goal_not_reached");
    expect(warning?.severity).toBe("warning");
  });

  it("every emitted insight has non-empty copy", () => {
    const insights = generateInsights({ ...values, goalAmount: 100_000 }, metrics);
    for (const insight of insights) {
      expect(insight.title.length).toBeGreaterThan(0);
      expect(insight.message.length).toBeGreaterThan(0);
    }
  });
});
