import { describe, expect, it } from "vitest";

import { evaluateDebtRatioRules } from "./debt-ratio-rules";

describe("evaluateDebtRatioRules", () => {
  it("warns above 40%", () => {
    expect(evaluateDebtRatioRules({ debtRatioPct: 42 })).toEqual([
      { code: "high_debt_ratio", severity: "warning" },
    ]);
  });

  it("is healthy at or below 30%", () => {
    expect(evaluateDebtRatioRules({ debtRatioPct: 28 })).toEqual([
      { code: "healthy_debt_ratio", severity: "success" },
    ]);
    expect(evaluateDebtRatioRules({ debtRatioPct: 30 })).toEqual([
      { code: "healthy_debt_ratio", severity: "success" },
    ]);
  });

  it("is moderate between 30% and 40%", () => {
    expect(evaluateDebtRatioRules({ debtRatioPct: 35 })).toEqual([
      { code: "moderate_debt_ratio", severity: "info" },
    ]);
  });
});
