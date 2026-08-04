/**
 * Formas comunes a cualquier Journey. Cada Journey tiene sus propias
 * métricas (`TMetrics`), pero el resto de la forma del resultado —
 * insights, recomendaciones, comparación de escenarios, confianza — es
 * siempre la misma: "la UI nunca hablará con módulos internos, solo con
 * este objeto" (TDD-001).
 */
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

export interface ScenarioResult<TMetrics> {
  id: string;
  label: string;
  metrics: TMetrics;
}

export interface ScenarioComparison<TMetrics> {
  scenarios: ScenarioResult<TMetrics>[];
  explanation: string;
}

export interface DecisionResult<TMetrics> {
  summary: string;
  metrics: TMetrics;
  insights: Insight[];
  warnings: Insight[];
  recommendations: Recommendation[];
  comparison: ScenarioComparison<TMetrics>;
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
