import { describe, expect, it } from "vitest";

import { evaluatePurchaseCosts } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { PurchaseCostsDecisionInput } from "./types";

const baseInput: PurchaseCostsDecisionInput = {
  journeyId: "purchase-costs",
  version: "1.0.0",
  locale: "es",
  values: { propertyPrice: 250_000, isNewConstruction: false },
};

describe("evaluatePurchaseCosts", () => {
  it("returns a result with the same shape as any other Journey", () => {
    const result = evaluatePurchaseCosts(baseInput);

    expect(result.summary).toContain("€");
    expect(result.metrics.total).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("purchase-costs");
  });

  it("is deterministic", () => {
    const a = evaluatePurchaseCosts(baseInput);
    const b = evaluatePurchaseCosts(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: PurchaseCostsDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, propertyPrice: -1 },
    };
    expect(() => evaluatePurchaseCosts(invalidInput)).toThrow(DecisionValidationError);
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluatePurchaseCosts(baseInput);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
