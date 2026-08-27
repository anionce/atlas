import { computeMetrics } from "./metrics";
import { generateInsights } from "./insights";
import { generateRecommendations } from "./recommendations";
import { compareScenarios } from "./scenarios";
import type { DecisionResult, Insight } from "../../shared-types";
import type {
  CompoundInterestDecisionInput,
  CompoundInterestInputValues,
  CompoundInterestMetrics,
} from "./types";
import { validateCompoundInterestInput } from "./validator";

const OPTIONAL_FIELDS = ["initialAmount", "goalAmount"] as const;

function formatEuros(amount: number): string {
  return Math.round(amount).toLocaleString("es-ES", { useGrouping: "always" });
}

function computeConfidence(values: CompoundInterestInputValues): number {
  const missing = OPTIONAL_FIELDS.filter((field) => values[field] === undefined).length;
  return Math.max(70, 100 - missing * 10);
}

/**
 * Punto de entrada del Journey "compound-interest". Mismo flujo que
 * "buy-home" (Validate → Calculate → Evaluate Rules → Generate Insights →
 * Generate Recommendations → Compare Scenarios → Build Result), pero sin
 * compartir ni una línea de lógica de negocio con él: solo la forma del
 * resultado es común.
 */
export function evaluateCompoundInterest(
  input: CompoundInterestDecisionInput,
): DecisionResult<CompoundInterestMetrics> {
  validateCompoundInterestInput(input.values);

  const metrics = computeMetrics(input.values);

  const allInsights = generateInsights(input.values, metrics);
  const insights = allInsights.filter((insight) => insight.severity !== "warning");
  const warnings: Insight[] = allInsights.filter((insight) => insight.severity === "warning");

  const recommendations = generateRecommendations(input.values, metrics);
  const comparison = compareScenarios(input.values);

  const summary = `En ${input.values.years} años podrías tener aproximadamente ${formatEuros(metrics.finalBalance)} €.`;

  const nextSteps = [
    "Compara escenarios para ver cuánto cambia aportar un poco más cada mes.",
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
