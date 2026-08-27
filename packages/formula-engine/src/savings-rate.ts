export interface SavingsRateInput {
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface SavingsRateResult {
  monthlySavings: number;
  /** Porcentaje de tus ingresos que ahorras. 0 si el ingreso no es positivo. */
  savingsRatePct: number;
}

/**
 * Qué parte de tus ingresos te queda para invertir, en euros y en
 * porcentaje. Puede ser negativo (gastas más de lo que ingresas) — no se
 * limita a 0 aquí porque quien llama a esta función es quien decide cómo
 * comunicarlo.
 */
export function calculateSavingsRate(input: SavingsRateInput): SavingsRateResult {
  const { monthlyIncome, monthlyExpenses } = input;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRatePct = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  return { monthlySavings, savingsRatePct };
}
