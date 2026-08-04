import { describe, expect, it } from "vitest";

import { evaluateMortgageRules } from "./mortgage-rules";

describe("evaluateMortgageRules", () => {
  it("flags a strong down payment at or above 30%", () => {
    expect(evaluateMortgageRules({ downPaymentRatio: 0.3 })).toEqual([
      { code: "strong_down_payment", severity: "success" },
    ]);
  });

  it("has nothing to say about a standard 20% down payment", () => {
    expect(evaluateMortgageRules({ downPaymentRatio: 0.2 })).toEqual([]);
  });
});
