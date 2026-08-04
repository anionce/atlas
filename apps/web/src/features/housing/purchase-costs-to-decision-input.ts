import type { PurchaseCostsDecisionInput, PurchaseCostsInputValues } from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): PurchaseCostsDecisionInput {
  const values: PurchaseCostsInputValues = {
    propertyPrice: Number(answers.propertyPrice),
    isNewConstruction: Boolean(answers.isNewConstruction),
    region:
      typeof answers.region === "string"
        ? (answers.region as PurchaseCostsInputValues["region"])
        : undefined,
  };

  return {
    journeyId: "purchase-costs",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
