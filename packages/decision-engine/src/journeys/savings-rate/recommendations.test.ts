import { describe, expect, it } from "vitest";

import { generateRecommendations } from "./recommendations";
import type { SavingsRateMetrics } from "./types";

describe("generateRecommendations", () => {
  it("always includes compare_scenarios and never exceeds 3 recommendations", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 500,
      savingsRatePct: 25,
      fireNumber: 450_000,
      monthsToFire: 200,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "compare_scenarios")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it("suggests reducing expenses and increasing income when the savings rate is low", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 100,
      savingsRatePct: 5,
      fireNumber: 450_000,
      monthsToFire: 400,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "reduce_expenses")).toBe(true);
    expect(recommendations.some((r) => r.id === "increase_income")).toBe(true);
  });

  it("does not push expense/income recommendations once the savings rate is already healthy", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 1_000,
      savingsRatePct: 40,
      fireNumber: 450_000,
      monthsToFire: 150,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "reduce_expenses")).toBe(false);
    expect(recommendations.some((r) => r.id === "increase_income")).toBe(false);
  });
});
