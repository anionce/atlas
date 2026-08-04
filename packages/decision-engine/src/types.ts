/**
 * Contrato genérico de TDD-001. Para la v1 solo existe el Journey "buy-home",
 * así que `values` está tipado para ese caso concreto en lugar de construir
 * ya un registro de Journeys que todavía no necesitamos (la primera versión
 * debe seguir siendo pequeña).
 */
export interface DecisionInput {
  journeyId: "buy-home";
  version: string;
  locale: "es";
  values: BuyHomeInputValues;
}

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
}

export type InsightSeverity = "success" | "warning" | "info";

export interface Insight {
  code: string;
  severity: InsightSeverity;
  title: string;
  message: string;
}

export interface Recommendation {
  id: string;
  title: string;
  message: string;
  impact: "low" | "medium" | "high";
  priority: number;
  category: string;
}

export interface DecisionMetrics {
  maxPropertyPrice: number;
  requiredEntry: number;
  monthlyPayment: number;
  totalInterest: number;
  debtRatioPct: number;
  purchaseCosts: number;
}

export interface ScenarioResult {
  id: string;
  label: string;
  metrics: DecisionMetrics;
}

export interface ScenarioComparison {
  scenarios: ScenarioResult[];
  explanation: string;
}

export interface DecisionResult {
  summary: string;
  metrics: DecisionMetrics;
  insights: Insight[];
  warnings: Insight[];
  recommendations: Recommendation[];
  comparison: ScenarioComparison;
  nextSteps: string[];
  confidence: number;
  metadata: {
    journeyId: string;
    version: string;
    locale: string;
    calculatedAt: string;
  };
}

export interface DecisionError {
  code: string;
  message: string;
  field?: string;
  severity: "error" | "warning";
}
