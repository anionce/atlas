import type { RuleTrigger } from "./types";

export interface SavingsRateRulesInput {
  savingsRatePct: number;
}

const EXCELLENT_THRESHOLD_PCT = 50;
const LOW_THRESHOLD_PCT = 10;

export function evaluateSavingsRateRules({ savingsRatePct }: SavingsRateRulesInput): RuleTrigger[] {
  if (savingsRatePct <= 0) {
    return [{ code: "not_saving", severity: "warning" }];
  }
  if (savingsRatePct < LOW_THRESHOLD_PCT) {
    return [{ code: "savings_rate_low", severity: "warning" }];
  }
  if (savingsRatePct >= EXCELLENT_THRESHOLD_PCT) {
    return [{ code: "savings_rate_excellent", severity: "success" }];
  }
  return [];
}
