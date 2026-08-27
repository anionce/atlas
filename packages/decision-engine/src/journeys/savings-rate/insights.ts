import { evaluateFireRules, evaluateSavingsRateRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { SavingsRateMetrics } from "./types";

const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  not_saving: {
    title: "No estás ahorrando nada",
    message:
      "Gastas lo mismo o más de lo que ingresas, así que no queda nada para invertir. Sin margen de ahorro, ningún plan de inversión puede arrancar.",
  },
  savings_rate_low: {
    title: "Tu tasa de ahorro es baja",
    message:
      "Con menos del 10 % de lo que ingresas, el camino a la independencia financiera es largo. Subir la tasa de ahorro es la palanca más potente que tienes — más que la rentabilidad de tus inversiones.",
  },
  savings_rate_excellent: {
    title: "Tu tasa de ahorro es excelente",
    message:
      "Ahorrando la mitad o más de lo que ingresas, el camino a la independencia financiera se acorta drásticamente frente a la media.",
  },
  fire_unreachable: {
    title: "Con este ritmo no llegarías a FIRE",
    message: "Al ritmo actual, tu ahorro no alcanza el capital necesario para vivir de las rentas.",
  },
  fire_within_decade: {
    title: "Estás a menos de una década",
    message: "Al ritmo actual, podrías alcanzar la independencia financiera en menos de 10 años.",
  },
};

export function generateInsights(metrics: SavingsRateMetrics): Insight[] {
  const triggers = [
    ...evaluateSavingsRateRules({ savingsRatePct: metrics.savingsRatePct }),
    // Si no ahorras nada, "not_saving" ya lo dice todo — añadir también
    // "fire_unreachable" sería repetir el mismo aviso con otras palabras.
    ...(metrics.savingsRatePct > 0
      ? evaluateFireRules({ monthsToFire: metrics.monthsToFire })
      : []),
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
