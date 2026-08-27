import { computeMetrics } from "./metrics";
import type { ScenarioComparison, ScenarioResult } from "../../shared-types";
import type { PurchaseCostsInputValues, PurchaseCostsMetrics } from "./types";

/**
 * A diferencia de los otros Journeys, aquí no hay un "aporta más" natural:
 * lo más útil es comparar el mismo precio como obra nueva frente a segunda
 * mano, que es la variable que más cambia el resultado.
 */
export function compareScenarios(
  values: PurchaseCostsInputValues,
): ScenarioComparison<PurchaseCostsMetrics> {
  const scenarios: ScenarioResult<PurchaseCostsMetrics>[] = [
    {
      id: "as-entered",
      label: values.isNewConstruction ? "Vivienda nueva" : "Segunda mano",
      metrics: computeMetrics(values),
    },
    {
      id: "alternative",
      label: values.isNewConstruction ? "Si fuera segunda mano" : "Si fuera obra nueva",
      metrics: computeMetrics({ ...values, isNewConstruction: !values.isNewConstruction }),
    },
  ];

  return { scenarios, explanation: buildExplanation(scenarios) };
}

function buildExplanation(scenarios: ScenarioResult<PurchaseCostsMetrics>[]): string {
  const [current, alternative] = scenarios;
  if (!current || !alternative) {
    return "No hay suficientes escenarios para comparar.";
  }

  const difference = alternative.metrics.total - current.metrics.total;
  if (Math.abs(difference) < 1) {
    return "El tipo de vivienda no cambia significativamente el gasto en este caso.";
  }

  const cheaper = difference < 0 ? alternative.label : current.label;
  return `"${cheaper}" saldría aproximadamente ${Math.round(Math.abs(difference)).toLocaleString("es-ES", { useGrouping: "always" })} € más barato en impuestos y gastos.`;
}
