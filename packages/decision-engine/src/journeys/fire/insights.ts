import { evaluateFireRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { FireMetrics } from "./types";

const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  fire_unreachable: {
    title: "Con este ritmo no llegarías a FIRE",
    message:
      "Al ritmo actual, tu inversión no alcanza el capital necesario para vivir de las rentas. Aumentar la aportación mensual o revisar el gasto objetivo cambiaría esto.",
  },
  fire_within_decade: {
    title: "Estás a menos de una década",
    message: "Al ritmo actual, podrías alcanzar la independencia financiera en menos de 10 años.",
  },
};

export function generateInsights(metrics: FireMetrics): Insight[] {
  const triggers = evaluateFireRules({ monthsToFire: metrics.monthsToFire });

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
