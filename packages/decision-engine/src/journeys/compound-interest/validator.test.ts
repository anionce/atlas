import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validateCompoundInterestInput } from "./validator";
import type { CompoundInterestInputValues } from "./types";

const validValues: CompoundInterestInputValues = {
  monthlyContribution: 200,
  annualReturnRate: 6,
  years: 15,
};

describe("validateCompoundInterestInput", () => {
  it("accepts a valid set of values", () => {
    expect(() => validateCompoundInterestInput(validValues)).not.toThrow();
  });

  it("accepts a zero monthly contribution (initial capital only)", () => {
    expect(() =>
      validateCompoundInterestInput({ ...validValues, monthlyContribution: 0 }),
    ).not.toThrow();
  });

  it("rejects a negative initial amount", () => {
    expect(() => validateCompoundInterestInput({ ...validValues, initialAmount: -100 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a negative monthly contribution", () => {
    expect(() =>
      validateCompoundInterestInput({ ...validValues, monthlyContribution: -50 }),
    ).toThrow(DecisionValidationError);
  });

  it("rejects an unrealistic return rate", () => {
    expect(() => validateCompoundInterestInput({ ...validValues, annualReturnRate: 50 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a horizon over 60 years", () => {
    expect(() => validateCompoundInterestInput({ ...validValues, years: 80 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a goal of zero or less", () => {
    expect(() => validateCompoundInterestInput({ ...validValues, goalAmount: 0 })).toThrow(
      DecisionValidationError,
    );
  });
});
