import { describe, expect, it } from "vitest";

import { toDecisionInput } from "./to-decision-input";

describe("toDecisionInput", () => {
  it("maps required answers into the CompoundInterestDecisionInput contract", () => {
    const input = toDecisionInput({
      monthlyContribution: 200,
      annualReturnRate: 6,
      years: 15,
    });

    expect(input.journeyId).toBe("compound-interest");
    expect(input.values.monthlyContribution).toBe(200);
    expect(input.values.initialAmount).toBeUndefined();
    expect(input.values.goalAmount).toBeUndefined();
  });

  it("passes through optional answers when present", () => {
    const input = toDecisionInput({
      initialAmount: 1_000,
      monthlyContribution: 200,
      annualReturnRate: 6,
      years: 15,
      goalAmount: 40_000,
    });

    expect(input.values.initialAmount).toBe(1_000);
    expect(input.values.goalAmount).toBe(40_000);
  });
});
