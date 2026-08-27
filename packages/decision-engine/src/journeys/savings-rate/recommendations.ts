import type { Recommendation } from "../../shared-types";
import type { SavingsRateMetrics } from "./types";

const MAX_RECOMMENDATIONS = 3;
const LOW_SAVINGS_RATE_THRESHOLD_PCT = 20;

export function generateRecommendations(metrics: SavingsRateMetrics): Recommendation[] {
  const candidates: Recommendation[] = [];

  if (metrics.savingsRatePct < LOW_SAVINGS_RATE_THRESHOLD_PCT) {
    candidates.push({
      id: "reduce_expenses",
      title: "Revisa tus gastos fijos",
      message:
        "Bajar el gasto mensual, aunque sea un poco, sube tu tasa de ahorro más rápido que subir tus ingresos en la misma proporción.",
      impact: "high",
      priority: 1,
      category: "savings",
    });
    candidates.push({
      id: "increase_income",
      title: "Aumenta tus ingresos",
      message:
        "Cada euro adicional de ingreso que no se traduzca en más gasto sube directamente tu tasa de ahorro.",
      impact: "medium",
      priority: 2,
      category: "savings",
    });
  }

  candidates.push({
    id: "compare_scenarios",
    title: "Compara escenarios antes de decidir",
    message:
      "Compara tu tasa de ahorro actual frente a subirla unos puntos para ver cuánto se acorta el camino.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
