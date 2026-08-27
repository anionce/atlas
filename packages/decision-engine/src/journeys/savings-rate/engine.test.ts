import { describe, expect, it } from "vitest";

import { evaluateSavingsRate } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { SavingsRateDecisionInput } from "./types";

const baseInput: SavingsRateDecisionInput = {
  journeyId: "savings-rate",
  version: "1.0.0",
  locale: "es",
  values: {
    monthlyIncome: 2_000,
    monthlyExpenses: 1_500,
    currentInvestments: 10_000,
    annualReturnRate: 6,
  },
};

describe("evaluateSavingsRate", () => {
  it("returns a result with the same shape as any other Journey", () => {
    const result = evaluateSavingsRate(baseInput);

    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.metrics.savingsRatePct).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("savings-rate");
  });

  it("is deterministic", () => {
    const a = evaluateSavingsRate(baseInput);
    const b = evaluateSavingsRate(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: SavingsRateDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, monthlyIncome: -1 },
    };
    expect(() => evaluateSavingsRate(invalidInput)).toThrow(DecisionValidationError);
  });

  it("summary mentions not saving when expenses match or exceed income", () => {
    const result = evaluateSavingsRate({
      ...baseInput,
      values: { ...baseInput.values, monthlyExpenses: 2_000 },
    });
    expect(result.summary).toContain("No te queda margen de ahorro");
  });

  it("lowers confidence when optional fields are missing", () => {
    const withOptionals = evaluateSavingsRate(baseInput);
    const withoutOptionals = evaluateSavingsRate({
      ...baseInput,
      values: { monthlyIncome: 2_000, monthlyExpenses: 1_500, annualReturnRate: 6 },
    });
    expect(withoutOptionals.confidence).toBeLessThan(withOptionals.confidence);
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluateSavingsRate(baseInput);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
