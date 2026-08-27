import { computeMetrics } from "./metrics";
import type { ScenarioComparison, ScenarioResult } from "../../shared-types";
import type { HistoricalBacktestInputValues, HistoricalBacktestMetrics } from "./types";

/** Cuánto gasta menos el escenario alternativo, en % del gasto original. */
const REDUCED_EXPENSE_MULTIPLIER = 0.9;

export function compareScenarios(
  values: HistoricalBacktestInputValues,
): ScenarioComparison<HistoricalBacktestMetrics> {
  const scenarios: ScenarioResult<HistoricalBacktestMetrics>[] = [
    { id: "current-plan", label: "Tu plan", metrics: computeMetrics(values) },
    {
      id: "reduced-expenses",
      label: "Gastando un 10 % menos",
      metrics: computeMetrics({
        ...values,
        monthlyExpenses: values.monthlyExpenses * REDUCED_EXPENSE_MULTIPLIER,
      }),
    },
  ];

  return { scenarios, explanation: buildExplanation(scenarios) };
}

function buildExplanation(scenarios: ScenarioResult<HistoricalBacktestMetrics>[]): string {
  const [base, alternative] = scenarios;
  if (!base || !alternative) {
    return "No hay suficientes escenarios para comparar.";
  }

  const difference = alternative.metrics.successRatePct - base.metrics.successRatePct;
  if (difference <= 0) {
    return "Tu plan actual ya tiene una tasa de éxito histórica igual o mejor que gastar menos.";
  }

  return `"${alternative.label}" subiría la tasa de éxito histórica del ${Math.round(base.metrics.successRatePct)} % al ${Math.round(alternative.metrics.successRatePct)} %.`;
}
