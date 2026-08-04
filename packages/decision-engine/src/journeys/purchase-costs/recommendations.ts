import type { Recommendation } from "../../shared-types";
import type { PurchaseCostsInputValues } from "./types";

const MAX_RECOMMENDATIONS = 3;

export function generateRecommendations(values: PurchaseCostsInputValues): Recommendation[] {
  const candidates: Recommendation[] = [];

  if (!values.isNewConstruction && !values.region) {
    candidates.push({
      id: "check_regional_itp",
      title: "Consulta el ITP de tu comunidad autónoma",
      message:
        "Usamos una media nacional del 7 %, pero el ITP real puede ser bastante distinto según dónde compres. Indica tu comunidad autónoma para un cálculo más preciso.",
      impact: "high",
      priority: 1,
      category: "taxes",
    });
  }

  candidates.push({
    id: "budget_buffer",
    title: "Reserva un margen extra",
    message:
      "Estos gastos son una estimación; reservar un 1-2 % adicional de margen es buena práctica.",
    impact: "medium",
    priority: 2,
    category: "budget",
  });

  candidates.push({
    id: "compare_scenarios",
    title: "Compara obra nueva y segunda mano",
    message:
      "Compara cuánto cambiaría el gasto si la vivienda fuera del otro tipo, al mismo precio.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
