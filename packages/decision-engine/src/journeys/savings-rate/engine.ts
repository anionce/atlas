import { computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionResult, Insight } from "../../shared-types";
import type { SavingsRateDecisionInput, SavingsRateInputValues, SavingsRateMetrics } from "./types";
import { validateSavingsRateInput } from "./validator";

const OPTIONAL_FIELDS = ["currentInvestments"] as const;

function computeConfidence(values: SavingsRateInputValues): number {
  const missing = OPTIONAL_FIELDS.filter((field) => values[field] === undefined).length;
  return Math.max(80, 100 - missing * 15);
}

function buildSummary(metrics: SavingsRateMetrics): string {
  const rounded = Math.round(metrics.savingsRatePct);
  if (metrics.savingsRatePct <= 0) {
    return "No te queda margen de ahorro: gastas lo mismo o más de lo que ingresas.";
  }
  return `Tu tasa de ahorro es del ${rounded} %.`;
}

/**
 * Punto de entrada del Journey "savings-rate". Reutiliza calculateFireNumber
 * y monthsToReachGoal del formula-engine, igual que "fire" — la diferencia
 * es que aquí la aportación mensual se deriva de ingresos menos gastos, en
 * vez de preguntarse directamente.
 */
export function evaluateSavingsRate(
  input: SavingsRateDecisionInput,
): DecisionResult<SavingsRateMetrics> {
  validateSavingsRateInput(input.values);

  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(metrics);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(metrics);
  const comparison = compareScenarios(input.values);

  const nextSteps = [
    "Compara escenarios para ver cuánto se acorta el camino subiendo tu tasa de ahorro.",
    "Guarda esta simulación para volver a consultarla más adelante.",
  ];

  return {
    summary: buildSummary(metrics),
    metrics,
    insights,
    warnings,
    recommendations,
    comparison,
    nextSteps,
    confidence: computeConfidence(input.values),
    metadata: {
      journeyId: input.journeyId,
      version: input.version,
      locale: input.locale,
      calculatedAt: new Date().toISOString(),
    },
  };
}
