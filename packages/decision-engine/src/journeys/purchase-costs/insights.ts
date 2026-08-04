import { evaluatePurchaseCostsRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { PurchaseCostsInputValues } from "./types";

const INSIGHT_COPY: Record<string, Omit<Insight, "code" | "severity">> = {
  new_construction_tax: {
    title: "Vivienda nueva: pagas IVA, no ITP",
    message: "Al ser obra nueva, el gasto principal es el IVA (10 %) más el AJD, no el ITP.",
  },
  resale_transfer_tax: {
    title: "Segunda mano: pagas ITP",
    message:
      "El ITP varía según la comunidad autónoma; aquí usamos una media nacional del 7 % como estimación.",
  },
};

export function generateInsights(values: PurchaseCostsInputValues): Insight[] {
  const triggers = evaluatePurchaseCostsRules({ isNewConstruction: values.isNewConstruction });

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
