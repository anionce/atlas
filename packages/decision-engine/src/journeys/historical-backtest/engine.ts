import { computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionResult, Insight } from "../../shared-types";
import type { HistoricalBacktestDecisionInput, HistoricalBacktestMetrics } from "./types";
import { validateHistoricalBacktestInput } from "./validator";

function computeConfidence(): number {
  // No hay campos opcionales en este Journey — la confianza depende solo
  // de que el dataset histórico cubra suficientes ventanas, ya reflejado
  // en totalSimulations, no en si faltan datos por rellenar.
  return 90;
}

function buildSummary(metrics: HistoricalBacktestMetrics): string {
  const rounded = Math.round(metrics.successRatePct);
  return `Este plan habría aguantado en el ${rounded} % de las ${metrics.totalSimulations} secuencias históricas reales posibles.`;
}

/**
 * Punto de entrada del Journey "historical-backtest". A diferencia del
 * resto de Journeys, no calcula un número único con una rentabilidad
 * media asumida — corre el plan contra cada secuencia histórica real
 * posible (`calculateHistoricalBacktest`) y reporta qué fracción habría
 * sobrevivido.
 */
export function evaluateHistoricalBacktest(
  input: HistoricalBacktestDecisionInput,
): DecisionResult<HistoricalBacktestMetrics> {
  validateHistoricalBacktestInput(input.values);

  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(metrics);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(metrics);
  const comparison = compareScenarios(input.values);

  const nextSteps = [
    "Compara escenarios para ver cuánto sube la tasa de éxito gastando menos.",
    "Prueba distintas estrategias de retirada para ver cuál aguanta mejor tu caso.",
  ];

  return {
    summary: buildSummary(metrics),
    metrics,
    insights,
    warnings,
    recommendations,
    comparison,
    nextSteps,
    confidence: computeConfidence(),
    metadata: {
      journeyId: input.journeyId,
      version: input.version,
      locale: input.locale,
      calculatedAt: new Date().toISOString(),
    },
  };
}
