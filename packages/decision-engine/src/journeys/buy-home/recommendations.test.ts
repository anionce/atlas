import { describe, expect, it } from "vitest";

import { calculateAffordability } from "@atlas/formula-engine";

import { generateRecommendations } from "./recommendations";
import type { BuyHomeInputValues } from "./types";

const baseValues: BuyHomeInputValues = {
  monthlyIncome: 2500,
  savings: 40_000,
  interestRate: 3.2,
  mortgageYears: 30,
  isNewConstruction: false,
};

describe("generateRecommendations", () => {
  it("suggests waiting and saving when limited by savings and the user gave a savings rate", () => {
    const values = { ...baseValues, monthlySavingsCapacity: 300 };
    const affordability = calculateAffordability({
      monthlyIncome: values.monthlyIncome,
      savings: values.savings,
      annualInterestRatePct: values.interestRate,
      years: values.mortgageYears,
    });
    const recommendations = generateRecommendations(values, affordability);
    expect(recommendations.some((r) => r.id === "wait_and_save")).toBe(true);
  });

  it("suggests reviewing term/price and increasing the down payment when income-constrained near the cap", () => {
    const values: BuyHomeInputValues = {
      ...baseValues,
      monthlyIncome: 1500,
      savings: 300_000,
    };
    const affordability = calculateAffordability({
      monthlyIncome: values.monthlyIncome,
      savings: values.savings,
      annualInterestRatePct: values.interestRate,
      years: values.mortgageYears,
    });
    expect(affordability.limitingFactor).toBe("income");

    const recommendations = generateRecommendations(values, affordability);
    expect(recommendations.some((r) => r.id === "reduce_term_or_price")).toBe(true);
    expect(recommendations.some((r) => r.id === "increase_down_payment")).toBe(true);
  });

  it("always includes compare_scenarios and never exceeds 3 recommendations", () => {
    const affordability = calculateAffordability({
      monthlyIncome: baseValues.monthlyIncome,
      savings: baseValues.savings,
      annualInterestRatePct: baseValues.interestRate,
      years: baseValues.mortgageYears,
    });
    const recommendations = generateRecommendations(baseValues, affordability);
    expect(recommendations.some((r) => r.id === "compare_scenarios")).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
  });

  it("sorts by priority ascending", () => {
    const affordability = calculateAffordability({
      monthlyIncome: 1500,
      savings: 300_000,
      annualInterestRatePct: 3.2,
      years: 30,
    });
    const recommendations = generateRecommendations(
      { ...baseValues, monthlyIncome: 1500, savings: 300_000 },
      affordability,
    );
    const priorities = recommendations.map((r) => r.priority);
    expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
  });
});
