import { computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionResult, Insight } from "../../shared-types";
import type { PurchaseCostsDecisionInput, PurchaseCostsMetrics } from "./types";
import { validatePurchaseCostsInput } from "./validator";

function formatEuros(amount: number): string {
  return Math.round(amount).toLocaleString("es-ES");
}

/**
 * Punto de entrada del Journey "purchase-costs". El más pequeño de los
 * cuatro: solo dos preguntas, y ni siquiera necesita una fórmula nueva —
 * calculatePurchaseCosts ya existía para "buy-home".
 */
export function evaluatePurchaseCosts(
  input: PurchaseCostsDecisionInput,
): DecisionResult<PurchaseCostsMetrics> {
  validatePurchaseCostsInput(input.values);

  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(input.values);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(input.values);
  const comparison = compareScenarios(input.values);

  const summary = `Comprar esta vivienda te costaría aproximadamente ${formatEuros(metrics.total)} € en impuestos y gastos (${metrics.totalPct.toFixed(1)} % del precio).`;

  const nextSteps = [
    "Compara obra nueva y segunda mano para ver cuánto cambia el gasto.",
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
    // Sin campos opcionales que puedan faltar: la confianza es siempre alta.
    confidence: 90,
    metadata: {
      journeyId: input.journeyId,
      version: input.version,
      locale: input.locale,
      calculatedAt: new Date().toISOString(),
    },
  };
}
