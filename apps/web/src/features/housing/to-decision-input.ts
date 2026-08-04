import type { BuyHomeInputValues, DecisionInput } from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): DecisionInput {
  const values: BuyHomeInputValues = {
    monthlyIncome: Number(answers.monthlyIncome),
    savings: Number(answers.savings),
    monthlyDebts: answers.monthlyDebts !== undefined ? Number(answers.monthlyDebts) : undefined,
    monthlySavingsCapacity:
      answers.monthlySavingsCapacity !== undefined
        ? Number(answers.monthlySavingsCapacity)
        : undefined,
    interestRate: Number(answers.interestRate),
    mortgageYears: Number(answers.mortgageYears),
    isNewConstruction: Boolean(answers.isNewConstruction),
  };

  return {
    journeyId: "buy-home",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
