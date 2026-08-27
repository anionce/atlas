import { describe, expect, it } from "vitest";

import { generateRecommendations } from "./recommendations";
import type { FireMetrics } from "./types";

describe("generateRecommendations", () => {
  it("always includes compare_scenarios and never exceeds 3 recommendations", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      coastFireNumberToday: 100_000,
      alreadyCoasting: false,
      coastFireAge: 50,
      monthsToFire: 90,
      ageAtFire: 37.5,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "compare_scenarios")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it("suggests increasing contribution and reducing expenses when far from FIRE", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      coastFireNumberToday: 100_000,
      alreadyCoasting: false,
      coastFireAge: 50,
      monthsToFire: null,
      ageAtFire: null,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "increase_contribution")).toBe(true);
    expect(recommendations.some((r) => r.id === "reduce_expenses")).toBe(true);
  });

  it("does not push increase_contribution when already within a decade", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      coastFireNumberToday: 100_000,
      alreadyCoasting: false,
      coastFireAge: 50,
      monthsToFire: 60,
      ageAtFire: 35,
    };
    const recommendations = generateRecommendations(metrics);
    expect(recommendations.some((r) => r.id === "increase_contribution")).toBe(false);
  });
});
