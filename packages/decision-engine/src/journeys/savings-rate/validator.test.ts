import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validateSavingsRateInput } from "./validator";
import type { SavingsRateInputValues } from "./types";

const validValues: SavingsRateInputValues = {
  monthlyIncome: 2_000,
  monthlyExpenses: 1_500,
  annualReturnRate: 6,
};

describe("validateSavingsRateInput", () => {
  it("accepts valid input without throwing", () => {
    expect(() => validateSavingsRateInput(validValues)).not.toThrow();
  });

  it("rejects a non-positive monthly income", () => {
    expect(() => validateSavingsRateInput({ ...validValues, monthlyIncome: 0 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a negative monthly expenses", () => {
    expect(() => validateSavingsRateInput({ ...validValues, monthlyExpenses: -1 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a negative currentInvestments when provided", () => {
    expect(() => validateSavingsRateInput({ ...validValues, currentInvestments: -100 })).toThrow(
      DecisionValidationError,
    );
  });

  it("accepts an undefined currentInvestments", () => {
    expect(() =>
      validateSavingsRateInput({ ...validValues, currentInvestments: undefined }),
    ).not.toThrow();
  });

  it("rejects an annual return rate outside 0-20%", () => {
    expect(() => validateSavingsRateInput({ ...validValues, annualReturnRate: -1 })).toThrow(
      DecisionValidationError,
    );
    expect(() => validateSavingsRateInput({ ...validValues, annualReturnRate: 21 })).toThrow(
      DecisionValidationError,
    );
  });
});
