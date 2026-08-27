import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";
import type { FireMetrics } from "./types";

describe("generateInsights", () => {
  it("warns when FIRE is unreachable", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      monthsToFire: null,
      ageAtFire: null,
    };
    const insights = generateInsights(metrics);
    const warning = insights.find((i) => i.code === "fire_unreachable");
    expect(warning?.severity).toBe("warning");
    expect(warning?.message.length).toBeGreaterThan(0);
  });

  it("celebrates reaching FIRE within a decade", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      monthsToFire: 90,
      ageAtFire: 37.5,
    };
    const insights = generateInsights(metrics);
    expect(insights.some((i) => i.code === "fire_within_decade" && i.severity === "success")).toBe(
      true,
    );
  });

  it("says nothing for a long but reachable horizon", () => {
    const metrics: FireMetrics = {
      fireNumber: 500_000,
      fireNumberAfterTax: 650_000,
      fireNumberWithPension: 650_000,
      effectiveMonthlyPension: 0,
      pensionSource: "none",
      reducedMonthlyExpensesAfterPension: 1_500,
      monthsToFire: 300,
      ageAtFire: 55,
    };
    expect(generateInsights(metrics)).toEqual([]);
  });
});
