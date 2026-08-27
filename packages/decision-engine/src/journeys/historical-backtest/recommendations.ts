import type { Recommendation } from "../../shared-types";
import type { HistoricalBacktestMetrics } from "./types";

const MAX_RECOMMENDATIONS = 3;
const LOW_SUCCESS_THRESHOLD_PCT = 90;

export function generateRecommendations(metrics: HistoricalBacktestMetrics): Recommendation[] {
  const candidates: Recommendation[] = [];

  if (metrics.successRatePct < LOW_SUCCESS_THRESHOLD_PCT) {
    candidates.push({
      id: "reduce_withdrawal",
      title: "Reduce el gasto o alarga el plazo",
      message:
        "Bajar el gasto mensual, o dar más margen de años a la cartera, sube directamente la tasa de éxito histórica.",
      impact: "high",
      priority: 1,
      category: "investing",
    });
    candidates.push({
      id: "try_dynamic_strategy",
      title: "Prueba una estrategia dinámica",
      message:
        "Las estrategias que ajustan el gasto según cómo le va a la cartera (como Guyton-Klinger) suelen aguantar mejor las malas secuencias que una retirada fija.",
      impact: "medium",
      priority: 2,
      category: "investing",
    });
  }

  candidates.push({
    id: "compare_scenarios",
    title: "Compara escenarios antes de decidir",
    message: "Compara tu plan frente a gastar algo menos para ver cuánto sube la tasa de éxito.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
