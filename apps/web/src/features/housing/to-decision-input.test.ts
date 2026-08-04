import { describe, expect, it } from "vitest";

import { toDecisionInput } from "./to-decision-input";

describe("toDecisionInput", () => {
  it("maps required answers into the DecisionInput contract", () => {
    const input = toDecisionInput({
      monthlyIncome: 2500,
      savings: 40_000,
      interestRate: 3.2,
      mortgageYears: 30,
      isNewConstruction: false,
    });

    expect(input.journeyId).toBe("buy-home");
    expect(input.values.monthlyIncome).toBe(2500);
    expect(input.values.monthlyDebts).toBeUndefined();
  });

  it("passes through optional answers when present", () => {
    const input = toDecisionInput({
      monthlyIncome: 2500,
      savings: 40_000,
      monthlyDebts: 200,
      monthlySavingsCapacity: 300,
      interestRate: 3.2,
      mortgageYears: 30,
      isNewConstruction: true,
    });

    expect(input.values.monthlyDebts).toBe(200);
    expect(input.values.monthlySavingsCapacity).toBe(300);
    expect(input.values.isNewConstruction).toBe(true);
  });

  it("passes through the region when present, and leaves it undefined otherwise", () => {
    const withRegion = toDecisionInput({
      monthlyIncome: 2500,
      savings: 40_000,
      interestRate: 3.2,
      mortgageYears: 30,
      isNewConstruction: false,
      region: "madrid",
    });
    expect(withRegion.values.region).toBe("madrid");

    const withoutRegion = toDecisionInput({
      monthlyIncome: 2500,
      savings: 40_000,
      interestRate: 3.2,
      mortgageYears: 30,
      isNewConstruction: false,
    });
    expect(withoutRegion.values.region).toBeUndefined();
  });
});
