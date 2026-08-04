import type {
  CompoundInterestDecisionInput,
  CompoundInterestInputValues,
} from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): CompoundInterestDecisionInput {
  const values: CompoundInterestInputValues = {
    initialAmount: answers.initialAmount !== undefined ? Number(answers.initialAmount) : undefined,
    monthlyContribution: Number(answers.monthlyContribution),
    annualReturnRate: Number(answers.annualReturnRate),
    years: Number(answers.years),
    goalAmount: answers.goalAmount !== undefined ? Number(answers.goalAmount) : undefined,
  };

  return {
    journeyId: "compound-interest",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
