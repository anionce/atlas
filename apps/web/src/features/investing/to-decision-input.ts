import type { FireDecisionInput, FireInputValues } from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): FireDecisionInput {
  const values: FireInputValues = {
    currentAge: Number(answers.currentAge),
    currentInvestments:
      answers.currentInvestments !== undefined ? Number(answers.currentInvestments) : undefined,
    monthlyContribution: Number(answers.monthlyContribution),
    annualReturnRate: Number(answers.annualReturnRate),
    monthlyExpenses: Number(answers.monthlyExpenses),
  };

  return {
    journeyId: "fire",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
