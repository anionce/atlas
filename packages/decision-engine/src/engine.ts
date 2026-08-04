import { computeAffordability, computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionInput, DecisionResult, Insight } from "./types";
import { validateBuyHomeInput } from "./validator";

const OPTIONAL_FIELDS = ["monthlyDebts", "monthlySavingsCapacity", "downPaymentRatio"] as const;

function formatEuros(amount: number): string {
  return Math.round(amount).toLocaleString("es-ES");
}

function computeConfidence(values: DecisionInput["values"]): number {
  const missing = OPTIONAL_FIELDS.filter((field) => values[field] === undefined).length;
  return Math.max(60, 100 - missing * 8);
}

/**
 * Punto de entrada único del Decision Engine: Validate → Calculate →
 * Evaluate Rules → Generate Insights → Generate Recommendations →
 * Compare Scenarios → Build Result. No conoce React, no conoce la UI,
 * no tiene estado.
 */
export function evaluateDecision(input: DecisionInput): DecisionResult {
  validateBuyHomeInput(input.values);

  const affordability = computeAffordability(input.values);
  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(metrics, metrics.requiredEntry, input.values.savings);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(input.values, affordability);
  const comparison = compareScenarios(input.values);

  const summary = `Puedes comprar una vivienda de aproximadamente ${formatEuros(metrics.maxPropertyPrice)} €.`;

  const nextSteps = [
    "Compara escenarios para ver qué opción te conviene más.",
    "Guarda esta simulación para volver a consultarla más adelante.",
  ];

  return {
    summary,
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
