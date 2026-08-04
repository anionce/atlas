import type { SpanishRegion } from "@atlas/formula-engine";

export interface PurchaseCostsInputValues {
  propertyPrice: number;
  isNewConstruction: boolean;
  /** Comunidad Autónoma; determina el tipo de ITP real en segunda mano. */
  region?: SpanishRegion;
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
