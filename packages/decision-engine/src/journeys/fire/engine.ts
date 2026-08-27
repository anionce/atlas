import { computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionResult, Insight } from "../../shared-types";
import type { FireDecisionInput, FireInputValues, FireMetrics } from "./types";
import { validateFireInput } from "./validator";

const OPTIONAL_FIELDS = ["currentInvestments"] as const;

function formatEuros(amount: number): string {
  return Math.round(amount).toLocaleString("es-ES");
}

function computeConfidence(values: FireInputValues): number {
  const missing = OPTIONAL_FIELDS.filter((field) => values[field] === undefined).length;
  return Math.max(75, 100 - missing * 15);
}

function buildSummary(metrics: FireMetrics): string {
  if (metrics.ageAtFire !== null) {
    return `Podrías alcanzar la independencia financiera aproximadamente a los ${Math.round(metrics.ageAtFire)} años.`;
  }
  return `Con este ritmo no alcanzarías el capital necesario (${formatEuros(metrics.fireNumberAfterTax)} €) para la independencia financiera.`;
}

/**
 * Punto de entrada del Journey "fire". Reutiliza el mismo formula-engine
 * que "compound-interest" para calcular cuánto tarda en llegar el capital
 * (monthsToReachGoal), y solo añade la fórmula que le es propia:
 * calculateFireNumber (la regla del 4 %).
 */
export function evaluateFire(input: FireDecisionInput): DecisionResult<FireMetrics> {
  validateFireInput(input.values);

  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(metrics);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(metrics);
  const comparison = compareScenarios(input.values);

  const nextSteps = [
    "Compara escenarios para ver cuánto se acorta el camino aportando más.",
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
