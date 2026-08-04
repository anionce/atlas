import { computeMetrics } from "./metrics";
import type { BuyHomeInputValues, ScenarioComparison, ScenarioResult } from "./types";

const HIGHER_DOWN_PAYMENT_RATIO = 0.3;

/**
 * Genera los escenarios comparables a partir de las mismas respuestas del
 * usuario: hoy, aportando más entrada, y (si nos ha dicho cuánto puede
 * ahorrar al mes) esperando un año. No inventa datos que el usuario no ha
 * dado.
 */
export function compareScenarios(values: BuyHomeInputValues): ScenarioComparison {
  const scenarios: ScenarioResult[] = [
    { id: "today", label: "Comprar hoy", metrics: computeMetrics(values) },
    {
      id: "higher-down-payment",
      label: "Aportando más entrada",
      metrics: computeMetrics({ ...values, downPaymentRatio: HIGHER_DOWN_PAYMENT_RATIO }),
    },
  ];

  if (values.monthlySavingsCapacity && values.monthlySavingsCapacity > 0) {
    scenarios.push({
      id: "wait-a-year",
      label: "Esperando 12 meses",
      metrics: computeMetrics({
        ...values,
        savings: values.savings + values.monthlySavingsCapacity * 12,
      }),
    });
  }

  const explanation = buildExplanation(scenarios);

  return { scenarios, explanation };
}

function buildExplanation(scenarios: ScenarioResult[]): string {
  const [base, ...alternatives] = scenarios;
  if (!base || alternatives.length === 0) {
    return "No hay suficientes escenarios para comparar.";
  }

  const best = alternatives.reduce((lowest, current) =>
    current.metrics.totalInterest < lowest.metrics.totalInterest ? current : lowest,
  );

  const interestSaved = base.metrics.totalInterest - best.metrics.totalInterest;
  if (interestSaved <= 0) {
    return "Comprar hoy es la opción con menos intereses totales de los escenarios comparados.";
  }

  return `"${best.label}" ahorraría aproximadamente ${Math.round(interestSaved).toLocaleString(
    "es-ES",
  )} € en intereses frente a comprar hoy.`;
}
