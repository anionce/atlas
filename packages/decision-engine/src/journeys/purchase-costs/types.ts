export interface PurchaseCostsInputValues {
  propertyPrice: number;
  isNewConstruction: boolean;
}

export interface PurchaseCostsDecisionInput {
  journeyId: "purchase-costs";
  version: string;
  locale: "es";
  values: PurchaseCostsInputValues;
}

export interface PurchaseCostsMetrics {
  transferTaxOrVat: number;
  stampDuty: number;
  notary: number;
  registry: number;
  appraisal: number;
  total: number;
  /** El total como % del precio, para dar contexto rápido. */
  totalPct: number;
}
