import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";
import type { SavingsRateMetrics } from "./types";

describe("generateInsights", () => {
  it("warns when the savings rate is zero or negative, without a redundant FIRE-unreachable warning", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 0,
      savingsRatePct: 0,
      fireNumber: 450_000,
      monthsToFire: null,
    };
    const insights = generateInsights(metrics);
    expect(insights.some((i) => i.code === "not_saving")).toBe(true);
    expect(insights.some((i) => i.code === "fire_unreachable")).toBe(false);
  });

  it("warns about a low but positive savings rate", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 100,
      savingsRatePct: 5,
      fireNumber: 450_000,
      monthsToFire: 400,
    };
    const insights = generateInsights(metrics);
    expect(insights.some((i) => i.code === "savings_rate_low")).toBe(true);
  });

  it("celebrates an excellent savings rate and a reachable-within-a-decade FIRE date", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 1_500,
      savingsRatePct: 60,
      fireNumber: 450_000,
      monthsToFire: 90,
    };
    const insights = generateInsights(metrics);
    expect(
      insights.some((i) => i.code === "savings_rate_excellent" && i.severity === "success"),
    ).toBe(true);
    expect(insights.some((i) => i.code === "fire_within_decade" && i.severity === "success")).toBe(
      true,
    );
  });

  it("says nothing about the savings rate for a middling, reachable-but-distant plan", () => {
    const metrics: SavingsRateMetrics = {
      monthlySavings: 400,
      savingsRatePct: 25,
      fireNumber: 450_000,
      monthsToFire: 300,
    };
    const insights = generateInsights(metrics);
    expect(insights).toEqual([]);
  });
});
