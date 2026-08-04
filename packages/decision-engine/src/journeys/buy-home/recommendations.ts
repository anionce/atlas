import type { AffordabilityResult } from "@atlas/formula-engine";

import type { Recommendation } from "../../shared-types";
import type { BuyHomeInputValues } from "./types";

const MAX_RECOMMENDATIONS = 3;

/**
 * A diferencia de los Insights (que explican), las recomendaciones proponen
 * una acción. Puede haber muchas candidatas; solo mostramos las tres con
 * mayor prioridad.
 */
export function generateRecommendations(
  values: BuyHomeInputValues,
  affordability: AffordabilityResult,
): Recommendation[] {
  const candidates: Recommendation[] = [];

  if (affordability.limitingFactor === "savings" && (values.monthlySavingsCapacity ?? 0) > 0) {
    candidates.push({
      id: "wait_and_save",
      title: "Espera unos meses y sigue ahorrando",
      message:
        "Ahorrando cada mes según tu capacidad actual, en unos meses podrías acceder a viviendas de mayor precio con la misma tranquilidad financiera.",
      impact: "high",
      priority: 1,
      category: "savings",
    });
  }

  if (affordability.limitingFactor === "income" && affordability.debtRatioPct >= 30) {
    candidates.push({
      id: "reduce_term_or_price",
      title: "Revisa el plazo o el precio objetivo",
      message:
        "Alargar el plazo o buscar una vivienda algo más económica reduciría tu cuota mensual a un nivel más cómodo.",
      impact: "high",
      priority: 1,
      category: "affordability",
    });
  }

  const currentDownPaymentRatio =
    affordability.requiredEntry > 0
      ? affordability.requiredEntry / affordability.maxPropertyPrice
      : 0.2;
  if (currentDownPaymentRatio < 0.3 && affordability.limitingFactor === "income") {
    candidates.push({
      id: "increase_down_payment",
      title: "Aumenta la entrada",
      message:
        "Si aportas más entrada, financias menos capital y reduces de forma notable los intereses totales del préstamo.",
      impact: "medium",
      priority: 2,
      category: "mortgage",
    });
  }

  candidates.push({
    id: "compare_scenarios",
    title: "Compara escenarios antes de decidir",
    message:
      "Compara comprar hoy frente a esperar o aportar más entrada para ver qué te conviene más.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
