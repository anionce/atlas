import type { SpanishRegion } from "@atlas/formula-engine";

export interface BuyHomeInputValues {
  monthlyIncome: number;
  monthlyDebts?: number;
  savings: number;
  /** Cuánto podría ahorrar al mes a partir de ahora; alimenta el escenario "esperar". */
  monthlySavingsCapacity?: number;
  interestRate: number;
  mortgageYears: number;
  isNewConstruction: boolean;
  downPaymentRatio?: number;
  /** Comunidad Autónoma; determina el tipo de ITP real en segunda mano. */
  region?: SpanishRegion;
}

export interface BuyHomeDecisionInput {
  journeyId: "buy-home";
  version: string;
  locale: "es";
  values: BuyHomeInputValues;
}

export interface BuyHomeMetrics {
  maxPropertyPrice: number;
  requiredEntry: number;
  monthlyPayment: number;
  totalInterest: number;
  debtRatioPct: number;
  purchaseCosts: number;
}
