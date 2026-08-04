import type { RuleTrigger } from "./types";

export interface SavingsGoalRulesInput {
  goalAmount: number;
  finalBalance: number;
}

export function evaluateSavingsGoalRules({
  goalAmount,
  finalBalance,
}: SavingsGoalRulesInput): RuleTrigger[] {
  if (finalBalance >= goalAmount) {
    return [{ code: "goal_reached", severity: "success" }];
  }
  return [{ code: "goal_not_reached", severity: "warning" }];
}
