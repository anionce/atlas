import { describe, expect, it } from "vitest";

import { evaluateFire } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { FireDecisionInput } from "./types";

const baseInput: FireDecisionInput = {
  journeyId: "fire",
  version: "1.0.0",
  locale: "es",
  values: {
    currentAge: 30,
    currentInvestments: 10_000,
    monthlyContribution: 800,
    annualReturnRate: 6,
    monthlyExpenses: 1_500,
  },
};

describe("evaluateFire", () => {
  it("returns a result with the same shape as any other Journey", () => {
    const result = evaluateFire(baseInput);

    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.metrics.fireNumber).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("fire");
  });

  it("is deterministic", () => {
    const a = evaluateFire(baseInput);
    const b = evaluateFire(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: FireDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, monthlyExpenses: -1 },
    };
    expect(() => evaluateFire(invalidInput)).toThrow(DecisionValidationError);
  });

  it("summary mentions the fire number when unreachable", () => {
    const result = evaluateFire({
      ...baseInput,
      values: {
        ...baseInput.values,
        currentInvestments: 0,
        monthlyContribution: 0,
        annualReturnRate: 0,
      },
    });
    expect(result.summary).toContain("€");
    expect(result.metrics.ageAtFire).toBeNull();
  });

  it("lowers confidence when optional fields are missing", () => {
    const withOptionals = evaluateFire(baseInput);
    const withoutOptionals = evaluateFire({
      ...baseInput,
      values: {
        currentAge: 30,
        monthlyContribution: 800,
        annualReturnRate: 6,
        monthlyExpenses: 1_500,
      },
    });
    expect(withoutOptionals.confidence).toBeLessThan(withOptionals.confidence);
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluateFire(baseInput);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
