import type { Recommendation } from "../../shared-types";
import type { CompoundInterestInputValues, CompoundInterestMetrics } from "./types";

const MAX_RECOMMENDATIONS = 3;

export function generateRecommendations(
  values: CompoundInterestInputValues,
  metrics: CompoundInterestMetrics,
): Recommendation[] {
  const candidates: Recommendation[] = [];

  if (values.goalAmount !== undefined && metrics.finalBalance < values.goalAmount) {
    candidates.push({
      id: "increase_contribution",
      title: "Aumenta tu aportación mensual",
      message:
        "Aportando algo más cada mes alcanzarías tu objetivo dentro del plazo que has elegido.",
      impact: "high",
      priority: 1,
      category: "savings",
    });
    candidates.push({
      id: "extend_horizon",
      title: "Alarga el plazo",
      message:
        "Dar más tiempo a que el interés compuesto haga su trabajo también te acercaría al objetivo.",
      impact: "medium",
      priority: 2,
      category: "savings",
    });
  }

  candidates.push({
    id: "start_early",
    title: "Empieza cuanto antes",
    message:
      "Cada mes que esperas para empezar es un mes menos de interés compuesto trabajando para ti.",
    impact: "low",
    priority: 3,
    category: "decision",
  });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, MAX_RECOMMENDATIONS);
}
