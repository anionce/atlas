import { describe, expect, it } from "vitest";

import { generateRecommendations } from "./recommendations";
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

describe("generateRecommendations", () => {
  it("always includes start_early and never exceeds 3 recommendations", () => {
    const recommendations = generateRecommendations(values, metrics);
    expect(recommendations.some((r) => r.id === "start_early")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it("suggests increasing contribution and extending the horizon when short of the goal", () => {
    const recommendations = generateRecommendations({ ...values, goalAmount: 100_000 }, metrics);
    expect(recommendations.some((r) => r.id === "increase_contribution")).toBe(true);
    expect(recommendations.some((r) => r.id === "extend_horizon")).toBe(true);
  });

  it("does not suggest increasing contribution when the goal is already met", () => {
    const recommendations = generateRecommendations({ ...values, goalAmount: 40_000 }, metrics);
    expect(recommendations.some((r) => r.id === "increase_contribution")).toBe(false);
  });

  it("sorts by priority ascending", () => {
    const recommendations = generateRecommendations({ ...values, goalAmount: 100_000 }, metrics);
    const priorities = recommendations.map((r) => r.priority);
    expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
  });
});
