import { describe, expect, it } from "vitest";

import { evaluateSavingsRateRules } from "./savings-rate-rules";

describe("evaluateSavingsRateRules", () => {
  it("warns when the savings rate is zero or negative", () => {
    expect(evaluateSavingsRateRules({ savingsRatePct: 0 })).toEqual([
      { code: "not_saving", severity: "warning" },
    ]);
    expect(evaluateSavingsRateRules({ savingsRatePct: -10 })).toEqual([
      { code: "not_saving", severity: "warning" },
    ]);
  });

  it("warns when the savings rate is low but positive", () => {
    expect(evaluateSavingsRateRules({ savingsRatePct: 5 })).toEqual([
      { code: "savings_rate_low", severity: "warning" },
    ]);
  });

  it("has nothing to say for a middling savings rate", () => {
    expect(evaluateSavingsRateRules({ savingsRatePct: 10 })).toEqual([]);
    expect(evaluateSavingsRateRules({ savingsRatePct: 30 })).toEqual([]);
  });

  it("celebrates an excellent savings rate", () => {
    expect(evaluateSavingsRateRules({ savingsRatePct: 50 })).toEqual([
      { code: "savings_rate_excellent", severity: "success" },
    ]);
    expect(evaluateSavingsRateRules({ savingsRatePct: 70 })).toEqual([
      { code: "savings_rate_excellent", severity: "success" },
    ]);
  });
});
