import {
  calculateCompoundInterest,
  calculateFireNumber,
  calculateFireNumberAfterTax,
  monthsToReachGoal,
} from "@atlas/formula-engine";

import type { FireInputValues, FireMetrics } from "./types";

/**
 * Qué fracción de la cartera, en el momento de llegar al número FIRE, es
 * ganancia acumulada por interés compuesto en vez de aportación tuya. Solo
 * esa parte tributa al retirarla. `null` cuando FIRE no es alcanzable, ya
 * que entonces no hay un "momento FIRE" real del que partir.
 */
function computeGainFraction(values: FireInputValues, monthsToFire: number | null): number {
  if (monthsToFire === null || monthsToFire === 0) return 0;

  const accumulation = calculateCompoundInterest({
    initialAmount: values.currentInvestments ?? 0,
    monthlyContribution: values.monthlyContribution,
    annualReturnRatePct: values.annualReturnRate,
    years: monthsToFire / 12,
  });

  if (accumulation.finalBalance <= 0) return 0;
  return Math.max(0, accumulation.totalInterestEarned / accumulation.finalBalance);
}

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

  const gainFraction = computeGainFraction(values, monthsToFire);
  const fireNumberAfterTax = calculateFireNumberAfterTax({
    monthlyExpenses: values.monthlyExpenses,
    gainFraction,
  });

  return { fireNumber, fireNumberAfterTax, monthsToFire, ageAtFire };
}
