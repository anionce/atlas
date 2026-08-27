import { computeMetrics } from "./metrics";
import type { ScenarioComparison, ScenarioResult } from "../../shared-types";
import type { SavingsRateInputValues, SavingsRateMetrics } from "./types";

/** Cuántos puntos porcentuales de tasa de ahorro añade el escenario alternativo. */
const SAVINGS_RATE_BOOST_PCT = 10;

export function compareScenarios(
  values: SavingsRateInputValues,
): ScenarioComparison<SavingsRateMetrics> {
  // Subir 10 puntos la tasa de ahorro equivale a bajar el gasto en un 10 %
  // de tus ingresos — así el ingreso no cambia, solo lo que gastas.
  const boostAmount = values.monthlyIncome * (SAVINGS_RATE_BOOST_PCT / 100);

  const scenarios: ScenarioResult<SavingsRateMetrics>[] = [
    { id: "current-plan", label: "Con tu tasa de ahorro actual", metrics: computeMetrics(values) },
    {
      id: "boosted-savings-rate",
      label: `Subiendo tu tasa de ahorro ${SAVINGS_RATE_BOOST_PCT} puntos`,
      metrics: computeMetrics({
        ...values,
        monthlyExpenses: Math.max(0, values.monthlyExpenses - boostAmount),
      }),
    },
  ];

  return { scenarios, explanation: buildExplanation(scenarios) };
}

function buildExplanation(scenarios: ScenarioResult<SavingsRateMetrics>[]): string {
  const [base, alternative] = scenarios;
  if (!base || !alternative) {
    return "No hay suficientes escenarios para comparar.";
  }

  if (base.metrics.monthsToFire === null && alternative.metrics.monthsToFire !== null) {
    return `"${alternative.label}" haría alcanzable tu independencia financiera, algo que tu tasa de ahorro actual no consigue.`;
  }
  if (base.metrics.monthsToFire === null || alternative.metrics.monthsToFire === null) {
    return "No hay suficientes datos para comparar los escenarios.";
  }

  const monthsSaved = base.metrics.monthsToFire - alternative.metrics.monthsToFire;
  if (monthsSaved <= 0) {
    return "Tu tasa de ahorro actual ya te lleva a FIRE tan rápido como los escenarios comparados.";
  }

  const yearsSaved = Math.round((monthsSaved / 12) * 10) / 10;
  return `"${alternative.label}" te permitiría alcanzar la independencia financiera aproximadamente ${yearsSaved} años antes.`;
}
