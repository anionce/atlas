import { computeMetrics } from "./metrics";
import type { ScenarioComparison, ScenarioResult } from "../../shared-types";
import type { FireInputValues, FireMetrics } from "./types";

const EXTRA_MONTHLY_CONTRIBUTION = 100;

/**
 * Multiplicadores convencionales de la comunidad FIRE para las tres
 * "tallas" del número: Lean (ajustado), Pleno (tu gasto tal cual lo diste)
 * y Fat (con holgura). No son una definición oficial ni universal — otras
 * calculadoras usan cifras algo distintas —, pero sirven como referencia
 * relativa a tu propio gasto en vez de a una cifra en dólares fija que no
 * tendría sentido aquí.
 */
const LEAN_FIRE_EXPENSE_MULTIPLIER = 0.7;
const FAT_FIRE_EXPENSE_MULTIPLIER = 1.5;

export function compareScenarios(values: FireInputValues): ScenarioComparison<FireMetrics> {
  const scenarios: ScenarioResult<FireMetrics>[] = [
    { id: "current-plan", label: "Con tu plan actual", metrics: computeMetrics(values) },
    {
      id: "extra-contribution",
      label: `Aportando ${EXTRA_MONTHLY_CONTRIBUTION} € más al mes`,
      metrics: computeMetrics({
        ...values,
        monthlyContribution: values.monthlyContribution + EXTRA_MONTHLY_CONTRIBUTION,
      }),
    },
    {
      id: "lean-fire",
      label: "Lean FIRE (gasto ajustado)",
      metrics: computeMetrics({
        ...values,
        monthlyExpenses: values.monthlyExpenses * LEAN_FIRE_EXPENSE_MULTIPLIER,
      }),
    },
    {
      id: "fat-fire",
      label: "Fat FIRE (con holgura)",
      metrics: computeMetrics({
        ...values,
        monthlyExpenses: values.monthlyExpenses * FAT_FIRE_EXPENSE_MULTIPLIER,
      }),
    },
  ];

  return { scenarios, explanation: buildExplanation(scenarios) };
}

function buildExplanation(scenarios: ScenarioResult<FireMetrics>[]): string {
  const [base, alternative] = scenarios;
  if (!base || !alternative) {
    return "No hay suficientes escenarios para comparar.";
  }

  if (base.metrics.monthsToFire === null && alternative.metrics.monthsToFire !== null) {
    return `"${alternative.label}" haría alcanzable tu independencia financiera, algo que tu plan actual no consigue.`;
  }
  if (base.metrics.monthsToFire === null || alternative.metrics.monthsToFire === null) {
    return "No hay suficientes datos para comparar los escenarios.";
  }

  const monthsSaved = base.metrics.monthsToFire - alternative.metrics.monthsToFire;
  if (monthsSaved <= 0) {
    return "Tu plan actual ya te lleva a FIRE tan rápido como los escenarios comparados.";
  }

  const yearsSaved = Math.round((monthsSaved / 12) * 10) / 10;
  return `"${alternative.label}" te permitiría alcanzar la independencia financiera aproximadamente ${yearsSaved} años antes.`;
}
