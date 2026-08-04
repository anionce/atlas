import { calculateCompoundInterest, monthsToReachGoal } from "@atlas/formula-engine";

import type { CompoundInterestInputValues, CompoundInterestMetrics } from "./types";

export function computeMetrics(values: CompoundInterestInputValues): CompoundInterestMetrics {
  const initialAmount = values.initialAmount ?? 0;

  const result = calculateCompoundInterest({
    initialAmount,
    monthlyContribution: values.monthlyContribution,
    annualReturnRatePct: values.annualReturnRate,
    years: values.years,
  });

  const monthsToGoal =
    values.goalAmount !== undefined
      ? monthsToReachGoal(
          values.goalAmount,
          initialAmount,
          values.monthlyContribution,
          values.annualReturnRate,
        )
      : null;

  return {
    finalBalance: result.finalBalance,
    totalContributed: result.totalContributed,
    totalInterestEarned: result.totalInterestEarned,
    monthsToGoal,
  };
}
