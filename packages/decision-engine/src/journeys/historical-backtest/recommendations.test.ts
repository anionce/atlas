import { describe, expect, it } from "vitest";

import { generateRecommendations } from "./recommendations";
import type { HistoricalBacktestMetrics } from "./types";

const baseMetrics: HistoricalBacktestMetrics = {
  successRatePct: 90,
  successCount: 62,
  totalSimulations: 69,
  simulations: [],
  withdrawalRatePct: 4,
};

describe("generateRecommendations", () => {
  it("always includes compare_scenarios and never exceeds 3 recommendations", () => {
    const recommendations = generateRecommendations(baseMetrics);
    expect(recommendations.some((r) => r.id === "compare_scenarios")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it("suggests reducing withdrawal and trying a dynamic strategy when success rate is low", () => {
    const recommendations = generateRecommendations({ ...baseMetrics, successRatePct: 70 });
    expect(recommendations.some((r) => r.id === "reduce_withdrawal")).toBe(true);
    expect(recommendations.some((r) => r.id === "try_dynamic_strategy")).toBe(true);
  });

  it("does not push those recommendations once the success rate is already healthy", () => {
    const recommendations = generateRecommendations({ ...baseMetrics, successRatePct: 95 });
    expect(recommendations.some((r) => r.id === "reduce_withdrawal")).toBe(false);
    expect(recommendations.some((r) => r.id === "try_dynamic_strategy")).toBe(false);
  });
});
