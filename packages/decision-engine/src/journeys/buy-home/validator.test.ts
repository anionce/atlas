import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validateBuyHomeInput } from "./validator";
import type { BuyHomeInputValues } from "./types";

const validValues: BuyHomeInputValues = {
  monthlyIncome: 2500,
  savings: 40_000,
  interestRate: 3.2,
  mortgageYears: 30,
  isNewConstruction: false,
};

describe("validateBuyHomeInput", () => {
  it("accepts a valid set of values", () => {
    expect(() => validateBuyHomeInput(validValues)).not.toThrow();
  });

  it("rejects zero or negative income", () => {
    expect(() => validateBuyHomeInput({ ...validValues, monthlyIncome: 0 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects negative savings", () => {
    expect(() => validateBuyHomeInput({ ...validValues, savings: -1 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a mortgage term over 40 years", () => {
    expect(() => validateBuyHomeInput({ ...validValues, mortgageYears: 80 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects an unrealistic interest rate", () => {
    expect(() => validateBuyHomeInput({ ...validValues, interestRate: 40 })).toThrow(
      DecisionValidationError,
    );
  });

  it("collects every validation error at once", () => {
    try {
      validateBuyHomeInput({ ...validValues, monthlyIncome: -1, savings: -1 });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(DecisionValidationError);
      expect((error as DecisionValidationError).errors).toHaveLength(2);
    }
  });
});
