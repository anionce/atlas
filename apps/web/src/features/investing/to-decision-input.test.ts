import { describe, expect, it } from "vitest";

import { toDecisionInput } from "./to-decision-input";

describe("toDecisionInput", () => {
  it("maps required answers into the FireDecisionInput contract", () => {
    const input = toDecisionInput({
      currentAge: 30,
      monthlyContribution: 500,
      annualReturnRate: 6,
      monthlyExpenses: 1_500,
    });

    expect(input.journeyId).toBe("fire");
    expect(input.values.currentAge).toBe(30);
    expect(input.values.currentInvestments).toBeUndefined();
  });

  it("passes through the optional current investments when present", () => {
    const input = toDecisionInput({
      currentAge: 30,
      currentInvestments: 10_000,
      monthlyContribution: 500,
      annualReturnRate: 6,
      monthlyExpenses: 1_500,
    });

    expect(input.values.currentInvestments).toBe(10_000);
  });
});
