import { computeMetrics } from "./metrics";
import type { ScenarioComparison, ScenarioResult } from "../../shared-types";
import type { CompoundInterestInputValues, CompoundInterestMetrics } from "./types";

const EXTRA_MONTHLY_CONTRIBUTION = 50;

export function compareScenarios(
  values: CompoundInterestInputValues,
): ScenarioComparison<CompoundInterestMetrics> {
  const scenarios: ScenarioResult<CompoundInterestMetrics>[] = [
    { id: "current-plan", label: "Con tu plan actual", metrics: computeMetrics(values) },
    {
      id: "extra-contribution",
      label: `Aportando ${EXTRA_MONTHLY_CONTRIBUTION} € más al mes`,
      metrics: computeMetrics({
        ...values,
        monthlyContribution: values.monthlyContribution + EXTRA_MONTHLY_CONTRIBUTION,
      }),
    },
  ];

  return { scenarios, explanation: buildExplanation(scenarios) };
}

function buildExplanation(scenarios: ScenarioResult<CompoundInterestMetrics>[]): string {
  const [base, alternative] = scenarios;
  if (!base || !alternative) {
    return "No hay suficientes escenarios para comparar.";
  }

  const difference = alternative.metrics.finalBalance - base.metrics.finalBalance;
  if (difference <= 0) {
    return "Tu plan actual ya es la mejor opción de los escenarios comparados.";
  }

  return `"${alternative.label}" terminaría con aproximadamente ${Math.round(
    difference,
  ).toLocaleString("es-ES", { useGrouping: "always" })} € más que tu plan actual.`;
}
