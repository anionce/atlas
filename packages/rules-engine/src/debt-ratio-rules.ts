import type { RuleTrigger } from "./types";

export interface DebtRatioRulesInput {
  debtRatioPct: number;
}

const HIGH_DEBT_RATIO_THRESHOLD = 40;
const HEALTHY_DEBT_RATIO_THRESHOLD = 30;

export function evaluateDebtRatioRules({ debtRatioPct }: DebtRatioRulesInput): RuleTrigger[] {
  if (debtRatioPct > HIGH_DEBT_RATIO_THRESHOLD) {
    return [{ code: "high_debt_ratio", severity: "warning" }];
  }
  if (debtRatioPct <= HEALTHY_DEBT_RATIO_THRESHOLD) {
    return [{ code: "healthy_debt_ratio", severity: "success" }];
  }
  return [{ code: "moderate_debt_ratio", severity: "info" }];
}
