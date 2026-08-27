import {
  calculateFireNumber,
  calculateSavingsRate,
  monthsToReachGoal,
} from "@atlas/formula-engine";

import type { SavingsRateInputValues, SavingsRateMetrics } from "./types";

export function computeMetrics(values: SavingsRateInputValues): SavingsRateMetrics {
  const { monthlySavings, savingsRatePct } = calculateSavingsRate({
    monthlyIncome: values.monthlyIncome,
    monthlyExpenses: values.monthlyExpenses,
  });

  const currentInvestments = values.currentInvestments ?? 0;
  const fireNumber = calculateFireNumber({ monthlyExpenses: values.monthlyExpenses });

  // Si no ahorras nada (o ahorras en negativo), monthsToReachGoal ya
  // devuelve null por sí solo — no hace falta un caso especial aquí.
  const monthsToFire = monthsToReachGoal(
    fireNumber,
    currentInvestments,
    monthlySavings,
    values.annualReturnRate,
  );

  return { monthlySavings, savingsRatePct, fireNumber, monthsToFire };
}
