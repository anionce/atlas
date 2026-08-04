import type { Recommendation } from "../../shared-types";
import type { FireMetrics } from "./types";

const MAX_RECOMMENDATIONS = 3;
const WITHIN_A_DECADE_MONTHS = 120;

export function generateRecommendations(metrics: FireMetrics): Recommendation[] {
  const candidates: Recommendation[] = [];

  const farFromFire =
    metrics.monthsToFire === null || metrics.monthsToFire > WITHIN_A_DECADE_MONTHS;

  if (farFromFire) {
    candidates.push({
      id: "increase_contribution",
      title: "Aumenta tu aportación mensual",
      message:
        "Cada euro adicional que inviertas cada mes acerca tu fecha de independencia financiera.",
      impact: "high",
      priority: 1,
      category: "investing",
    });
    candidates.push({
      id: "reduce_expenses",
      title: "Revisa tu gasto mensual objetivo",
      message:
        "Reducir el gasto mensual que necesitarías baja directamente el capital que hace falta para alcanzar FIRE.",
      impact: "medium",
      priority: 2,
      category: "investing",
    });
  }

  candidates.push({
    id: "compare_scenarios",
    title: "Compara escenarios antes de decidir",
    message:
      "Compara tu plan actual frente a aportar más cada mes para ver cuánto se acorta el camino.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
