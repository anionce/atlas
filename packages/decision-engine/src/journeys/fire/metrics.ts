import { calculateFireNumber, monthsToReachGoal } from "@atlas/formula-engine";

import type { FireInputValues, FireMetrics } from "./types";

export function computeMetrics(values: FireInputValues): FireMetrics {
  const currentInvestments = values.currentInvestments ?? 0;
  const fireNumber = calculateFireNumber({ monthlyExpenses: values.monthlyExpenses });

  const monthsToFire = monthsToReachGoal(
    fireNumber,
    currentInvestments,
    values.monthlyContribution,
    values.annualReturnRate,
  );

  const ageAtFire = monthsToFire !== null ? values.currentAge + monthsToFire / 12 : null;

  return { fireNumber, monthsToFire, ageAtFire };
}
