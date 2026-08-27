import type { RuleTrigger } from "./types";

export interface HistoricalBacktestRulesInput {
  successRatePct: number;
}

const LOW_SUCCESS_THRESHOLD_PCT = 80;
const HIGH_SUCCESS_THRESHOLD_PCT = 95;

export function evaluateHistoricalBacktestRules({
  successRatePct,
}: HistoricalBacktestRulesInput): RuleTrigger[] {
  if (successRatePct < LOW_SUCCESS_THRESHOLD_PCT) {
    return [{ code: "backtest_low_success", severity: "warning" }];
  }
  if (successRatePct >= HIGH_SUCCESS_THRESHOLD_PCT) {
    return [{ code: "backtest_high_success", severity: "success" }];
  }
  return [];
}
