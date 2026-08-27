import { describe, expect, it } from "vitest";

import { generateInsights } from "./insights";
import type { HistoricalBacktestMetrics } from "./types";

const baseMetrics: HistoricalBacktestMetrics = {
  successRatePct: 90,
  successCount: 62,
  totalSimulations: 69,
  simulations: [],
  withdrawalRatePct: 4,
};

describe("generateInsights", () => {
  it("warns when the success rate is below 80%", () => {
    const insights = generateInsights({ ...baseMetrics, successRatePct: 75 });
    const warning = insights.find((i) => i.code === "backtest_low_success");
    expect(warning?.severity).toBe("warning");
    expect(warning?.message.length).toBeGreaterThan(0);
  });

  it("celebrates a success rate of 95% or higher", () => {
    const insights = generateInsights({ ...baseMetrics, successRatePct: 96 });
    expect(
      insights.some((i) => i.code === "backtest_high_success" && i.severity === "success"),
    ).toBe(true);
  });

  it("says nothing for a middling success rate", () => {
    expect(generateInsights({ ...baseMetrics, successRatePct: 88 })).toEqual([]);
  });
});
