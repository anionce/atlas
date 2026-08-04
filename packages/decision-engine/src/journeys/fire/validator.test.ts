import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validateFireInput } from "./validator";
import type { FireInputValues } from "./types";

const validValues: FireInputValues = {
  currentAge: 30,
  monthlyContribution: 500,
  annualReturnRate: 6,
  monthlyExpenses: 1_500,
};

describe("validateFireInput", () => {
  it("accepts a valid set of values", () => {
    expect(() => validateFireInput(validValues)).not.toThrow();
  });

  it("rejects an age outside 18-100", () => {
    expect(() => validateFireInput({ ...validValues, currentAge: 15 })).toThrow(
      DecisionValidationError,
    );
    expect(() => validateFireInput({ ...validValues, currentAge: 120 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects negative current investments", () => {
    expect(() => validateFireInput({ ...validValues, currentInvestments: -100 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a negative monthly contribution", () => {
    expect(() => validateFireInput({ ...validValues, monthlyContribution: -1 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects an unrealistic return rate", () => {
    expect(() => validateFireInput({ ...validValues, annualReturnRate: 50 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects zero or negative monthly expenses", () => {
    expect(() => validateFireInput({ ...validValues, monthlyExpenses: 0 })).toThrow(
      DecisionValidationError,
    );
  });
});
