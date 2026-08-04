import type { RuleTrigger } from "./types";

export interface GrowthRulesInput {
  totalContributed: number;
  totalInterestEarned: number;
}

export function evaluateGrowthRules({
  totalContributed,
  totalInterestEarned,
}: GrowthRulesInput): RuleTrigger[] {
  if (totalContributed > 0 && totalInterestEarned > totalContributed) {
    return [{ code: "interest_exceeds_contributions", severity: "success" }];
  }
  return [];
}
