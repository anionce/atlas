import { evaluateGrowthRules, evaluateSavingsGoalRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { CompoundInterestInputValues, CompoundInterestMetrics } from "./types";

const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  goal_reached: {
    title: "Objetivo alcanzado",
    message: "Con este ritmo de ahorro, llegarías a tu objetivo dentro del plazo que has elegido.",
  },
  goal_not_reached: {
    title: "Objetivo no alcanzado en este plazo",
    message:
      "Con este ritmo de ahorro no llegarías a tu objetivo en el plazo elegido. Aportar más al mes o alargar el plazo lo cambiaría.",
  },
  interest_exceeds_contributions: {
    title: "El interés compuesto hace el trabajo pesado",
    message:
      "En este plazo, lo que ganas en intereses supera lo que aportas de tu bolsillo cada mes.",
  },
};

export function generateInsights(
  values: CompoundInterestInputValues,
  metrics: CompoundInterestMetrics,
): Insight[] {
  const triggers = [
    ...(values.goalAmount !== undefined
      ? evaluateSavingsGoalRules({
          goalAmount: values.goalAmount,
          finalBalance: metrics.finalBalance,
        })
      : []),
    ...evaluateGrowthRules({
      totalContributed: metrics.totalContributed,
      totalInterestEarned: metrics.totalInterestEarned,
    }),
  ];

  return triggers.map((trigger): Insight => {
    const copy = INSIGHT_COPY[trigger.code];
    return {
      code: trigger.code,
      severity: trigger.severity,
      title: copy?.title ?? trigger.code,
      message: copy?.message ?? "",
    };
  });
}
