import { describe, expect, it } from "vitest";

import { evaluateHistoricalBacktestRules } from "./historical-backtest-rules";

describe("evaluateHistoricalBacktestRules", () => {
  it("warns when the success rate is below 80%", () => {
    expect(evaluateHistoricalBacktestRules({ successRatePct: 79.9 })).toEqual([
      { code: "backtest_low_success", severity: "warning" },
    ]);
  });

  it("celebrates a success rate of 95% or higher", () => {
    expect(evaluateHistoricalBacktestRules({ successRatePct: 95 })).toEqual([
      { code: "backtest_high_success", severity: "success" },
    ]);
    expect(evaluateHistoricalBacktestRules({ successRatePct: 100 })).toEqual([
      { code: "backtest_high_success", severity: "success" },
    ]);
  });

  it("has nothing to say for a middling success rate", () => {
    expect(evaluateHistoricalBacktestRules({ successRatePct: 85 })).toEqual([]);
    expect(evaluateHistoricalBacktestRules({ successRatePct: 94.9 })).toEqual([]);
  });
});
