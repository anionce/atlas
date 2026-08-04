import {
  evaluateDebtRatioRules,
  evaluateMortgageRules,
  evaluateSavingsRules,
} from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { BuyHomeMetrics } from "./types";

/**
 * El Insight Generator traduce los códigos que emite el Rule Evaluator a
 * lenguaje natural. Separar código y texto es lo que permite que mañana esto
 * sea internacionalizable sin tocar las reglas.
 */
const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  high_debt_ratio: {
    title: "Cuota elevada",
    message:
      "Tu cuota supondría un porcentaje elevado de tus ingresos mensuales, por encima de lo que solemos considerar cómodo.",
  },
  moderate_debt_ratio: {
    title: "Cuota moderada",
    message: "Tu cuota es asumible, aunque no deja demasiado margen para imprevistos.",
  },
  healthy_debt_ratio: {
    title: "Endeudamiento saludable",
    message: "Tu ratio de endeudamiento es saludable.",
  },
  sufficient_savings: {
    title: "Ahorro suficiente",
    message: "Tu nivel de ahorro es bueno: cubre la entrada y los gastos de compra estimados.",
  },
  insufficient_savings: {
    title: "Ahorro insuficiente",
    message: "Tu ahorro actual no llega a cubrir la entrada y los gastos de compra estimados.",
  },
  strong_down_payment: {
    title: "Buena entrada",
    message: "Aportar una entrada así de alta reduce considerablemente los intereses totales.",
  },
};

export function generateInsights(metrics: BuyHomeMetrics, requiredEntry: number, savings: number) {
  const triggers = [
    ...evaluateDebtRatioRules({ debtRatioPct: metrics.debtRatioPct }),
    ...evaluateSavingsRules({ savings, requiredEntry }),
    ...evaluateMortgageRules({
      downPaymentRatio: requiredEntry > 0 ? requiredEntry / metrics.maxPropertyPrice : 0,
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
