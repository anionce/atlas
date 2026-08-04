import type { RuleTrigger } from "./types";

export interface MortgageRulesInput {
  downPaymentRatio: number;
}

const STRONG_DOWN_PAYMENT_THRESHOLD = 0.3;

export function evaluateMortgageRules({ downPaymentRatio }: MortgageRulesInput): RuleTrigger[] {
  if (downPaymentRatio >= STRONG_DOWN_PAYMENT_THRESHOLD) {
    return [{ code: "strong_down_payment", severity: "success" }];
  }
  return [];
}
