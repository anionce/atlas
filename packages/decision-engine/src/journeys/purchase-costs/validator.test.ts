import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validatePurchaseCostsInput } from "./validator";
import type { PurchaseCostsInputValues } from "./types";

describe("validatePurchaseCostsInput", () => {
  it("accepts a valid set of values", () => {
    expect(() =>
      validatePurchaseCostsInput({ propertyPrice: 250_000, isNewConstruction: false }),
    ).not.toThrow();
  });

  it("rejects a zero or negative property price", () => {
    const invalid: PurchaseCostsInputValues = { propertyPrice: 0, isNewConstruction: false };
    expect(() => validatePurchaseCostsInput(invalid)).toThrow(DecisionValidationError);
    expect(() => validatePurchaseCostsInput({ ...invalid, propertyPrice: -1 })).toThrow(
      DecisionValidationError,
    );
  });
});
