import type { RuleTrigger } from "./types";

export interface SavingsRulesInput {
  savings: number;
  requiredEntry: number;
}

export function evaluateSavingsRules({ savings, requiredEntry }: SavingsRulesInput): RuleTrigger[] {
  if (savings >= requiredEntry) {
    return [{ code: "sufficient_savings", severity: "success" }];
  }
  return [{ code: "insufficient_savings", severity: "warning" }];
}
