import { describe, expect, it } from "vitest";

import { toDecisionInput } from "./to-decision-input";

describe("toDecisionInput", () => {
  it("maps required answers into the SavingsRateDecisionInput contract", () => {
    const input = toDecisionInput({
      monthlyIncome: 2_000,
      monthlyExpenses: 1_500,
      annualReturnRate: 6,
    });

    expect(input.journeyId).toBe("savings-rate");
    expect(input.values.monthlyIncome).toBe(2_000);
    expect(input.values.monthlyExpenses).toBe(1_500);
    expect(input.values.annualReturnRate).toBe(6);
    expect(input.values.currentInvestments).toBeUndefined();
  });

  it("passes through the optional currentInvestments when present", () => {
    const input = toDecisionInput({
      monthlyIncome: 2_000,
      monthlyExpenses: 1_500,
      currentInvestments: 5_000,
      annualReturnRate: 6,
    });

    expect(input.values.currentInvestments).toBe(5_000);
  });
});
