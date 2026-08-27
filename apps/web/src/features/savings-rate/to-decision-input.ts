import type { SavingsRateDecisionInput, SavingsRateInputValues } from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): SavingsRateDecisionInput {
  const values: SavingsRateInputValues = {
    monthlyIncome: Number(answers.monthlyIncome),
    monthlyExpenses: Number(answers.monthlyExpenses),
    currentInvestments:
      answers.currentInvestments !== undefined ? Number(answers.currentInvestments) : undefined,
    annualReturnRate: Number(answers.annualReturnRate),
  };

  return {
    journeyId: "savings-rate",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
