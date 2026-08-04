import { describe, expect, it } from "vitest";

import { evaluateBuyHome } from "./engine";
import { DecisionValidationError } from "../../errors";
import type { BuyHomeDecisionInput } from "./types";

const baseInput: BuyHomeDecisionInput = {
  journeyId: "buy-home",
  version: "1.0.0",
  locale: "es",
  values: {
    monthlyIncome: 2500,
    savings: 40_000,
    interestRate: 3.2,
    mortgageYears: 30,
    isNewConstruction: false,
  },
};

describe("evaluateBuyHome", () => {
  it("returns a result with the same shape every time (Result Builder contract)", () => {
    const result = evaluateBuyHome(baseInput);

    expect(result.summary).toContain("€");
    expect(result.metrics.maxPropertyPrice).toBeGreaterThan(0);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.comparison.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(result.nextSteps)).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.metadata.journeyId).toBe("buy-home");
  });

  it("is deterministic: the same input always produces the same metrics", () => {
    const a = evaluateBuyHome(baseInput);
    const b = evaluateBuyHome(baseInput);
    expect(a.metrics).toEqual(b.metrics);
  });

  it("propagates validation errors instead of computing a result", () => {
    const invalidInput: BuyHomeDecisionInput = {
      ...baseInput,
      values: { ...baseInput.values, monthlyIncome: -100 },
    };
    expect(() => evaluateBuyHome(invalidInput)).toThrow(DecisionValidationError);
  });

  it("never returns more than 3 recommendations", () => {
    const result = evaluateBuyHome({
      ...baseInput,
      values: {
        ...baseInput.values,
        monthlyIncome: 1200,
        savings: 10_000,
        monthlySavingsCapacity: 200,
      },
    });
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });

  it("lowers confidence when optional fields are missing", () => {
    const withOptionals = evaluateBuyHome({
      ...baseInput,
      values: {
        ...baseInput.values,
        monthlyDebts: 0,
        monthlySavingsCapacity: 300,
        downPaymentRatio: 0.2,
      },
    });
    const withoutOptionals = evaluateBuyHome(baseInput);
    expect(withoutOptionals.confidence).toBeLessThan(withOptionals.confidence);
  });

  it("always reports a debt-ratio insight, since affordability is capped at a safe level", () => {
    const result = evaluateBuyHome(baseInput);
    const debtRatioCodes = ["healthy_debt_ratio", "moderate_debt_ratio", "high_debt_ratio"];
    const allFindings = [...result.insights, ...result.warnings];
    expect(allFindings.some((finding) => debtRatioCodes.includes(finding.code))).toBe(true);
  });

  it("adds a wait_and_save recommendation only when the user reported savings capacity", () => {
    const withoutCapacity = evaluateBuyHome({
      ...baseInput,
      values: { ...baseInput.values, savings: 5_000 },
    });
    const withCapacity = evaluateBuyHome({
      ...baseInput,
      values: { ...baseInput.values, savings: 5_000, monthlySavingsCapacity: 300 },
    });
    expect(withoutCapacity.recommendations.some((r) => r.id === "wait_and_save")).toBe(false);
    expect(withCapacity.recommendations.some((r) => r.id === "wait_and_save")).toBe(true);
  });
});
