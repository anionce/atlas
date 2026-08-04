import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";
import type { BuyHomeMetrics } from "./types";

const baseMetrics: BuyHomeMetrics = {
  maxPropertyPrice: 250_000,
  requiredEntry: 50_000,
  monthlyPayment: 900,
  totalInterest: 100_000,
  debtRatioPct: 20,
  purchaseCosts: 20_000,
};

describe("generateInsights", () => {
  it("turns a high debt ratio into a warning with human-readable copy", () => {
    const insights = generateInsights({ ...baseMetrics, debtRatioPct: 42 }, 50_000, 200_000);
    const warning = insights.find((i) => i.code === "high_debt_ratio");
    expect(warning?.severity).toBe("warning");
    expect(warning?.message.length).toBeGreaterThan(0);
  });

  it("turns insufficient savings into a warning", () => {
    const insights = generateInsights(baseMetrics, 50_000, 10_000);
    const warning = insights.find((i) => i.code === "insufficient_savings");
    expect(warning?.severity).toBe("warning");
  });

  it("every emitted insight has non-empty copy", () => {
    const insights = generateInsights({ ...baseMetrics, debtRatioPct: 42 }, 50_000, 10_000);
    for (const insight of insights) {
      expect(insight.title.length).toBeGreaterThan(0);
      expect(insight.message.length).toBeGreaterThan(0);
    }
  });
});
