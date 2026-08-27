import { evaluateHistoricalBacktestRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { HistoricalBacktestMetrics } from "./types";

const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  backtest_low_success: {
    title: "Tasa de éxito baja",
    message:
      "En menos del 80 % de las secuencias históricas reales, este plan no habría aguantado todo el plazo. Reducir el gasto, alargar el plazo o probar otra estrategia de retirada lo cambiaría.",
  },
  backtest_high_success: {
    title: "Tasa de éxito alta",
    message:
      "En el 95 % o más de las secuencias históricas reales, este plan habría aguantado todo el plazo sin agotarse.",
  },
};

export function generateInsights(metrics: HistoricalBacktestMetrics): Insight[] {
  const triggers = evaluateHistoricalBacktestRules({ successRatePct: metrics.successRatePct });

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
