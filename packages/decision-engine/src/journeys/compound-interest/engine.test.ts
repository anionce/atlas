import { describe, expect, it } from "vitest";

import { evaluateCompoundInterest } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { CompoundInterestDecisionInput } from "./types";

const baseInput: CompoundInterestDecisionInput = {
  journeyId: "compound-interest",
  version: "1.0.0",
  locale: "es",
  values: {
    monthlyContribution: 200,
    annualReturnRate: 6,
    years: 15,
  },
};

describe("evaluateCompoundInterest", () => {
  it("returns a result with the same shape as any other Journey", () => {
    const result = evaluateCompoundInterest(baseInput);

    expect(result.summary).toContain("€");
    expect(result.metrics.finalBalance).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("compound-interest");
  });

  it("is deterministic", () => {
    const a = evaluateCompoundInterest(baseInput);
    const b = evaluateCompoundInterest(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: CompoundInterestDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, monthlyContribution: -100 },
    };
    expect(() => evaluateCompoundInterest(invalidInput)).toThrow(DecisionValidationError);
  });

  it("lowers confidence when optional fields are missing", () => {
    const withOptionals = evaluateCompoundInterest({
      ...baseInput,
      values: { ...baseInput.values, initialAmount: 1_000, goalAmount: 40_000 },
    });
    const withoutOptionals = evaluateCompoundInterest(baseInput);
    expect(withoutOptionals.confidence).toBeLessThan(withOptionals.confidence);
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluateCompoundInterest({
      ...baseInput,
      values: { ...baseInput.values, goalAmount: 1_000_000 },
    });
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
