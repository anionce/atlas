import { describe, expect, it } from "vitest";

import { evaluateHistoricalBacktest } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { HistoricalBacktestDecisionInput } from "./types";

const baseInput: HistoricalBacktestDecisionInput = {
  journeyId: "historical-backtest",
  version: "1.0.0",
  locale: "es",
  values: {
    initialPortfolio: 1_000_000,
    monthlyExpenses: 3_333.33,
    stockAllocationPct: 80,
    years: 30,
    withdrawalStrategyId: "constantDollar",
  },
};

describe("evaluateHistoricalBacktest", () => {
  it("returns a result with the same shape as any other Journey", () => {
    const result = evaluateHistoricalBacktest(baseInput);

    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.metrics.successRatePct).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("historical-backtest");
  });

  it("is deterministic", () => {
    const a = evaluateHistoricalBacktest(baseInput);
    const b = evaluateHistoricalBacktest(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: HistoricalBacktestDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, initialPortfolio: -1 },
    };
    expect(() => evaluateHistoricalBacktest(invalidInput)).toThrow(DecisionValidationError);
  });

  it("summary mentions the success rate and total simulations", () => {
    const result = evaluateHistoricalBacktest(baseInput);
    expect(result.summary).toContain("%");
    expect(result.summary).toContain(String(result.metrics.totalSimulations));
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluateHistoricalBacktest(baseInput);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
