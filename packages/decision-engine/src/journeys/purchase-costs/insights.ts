import {
  DEFAULT_ITP_RATE,
  ITP_BRACKETS_BY_REGION,
  ITP_RATE_BY_REGION,
} from "@atlas/formula-engine";
import { evaluatePurchaseCostsRules } from "@atlas/rules-engine";

import type { Insight } from "../../shared-types";
import type { PurchaseCostsInputValues } from "./types";

const NEW_CONSTRUCTION_COPY: Omit<Insight, "code" | "severity"> = {
  title: "Vivienda nueva: pagas IVA, no ITP",
  message: "Al ser obra nueva, el gasto principal es el IVA (10 %) más el AJD, no el ITP.",
};

function resaleTransferTaxCopy(
  values: PurchaseCostsInputValues,
): Omit<Insight, "code" | "severity"> {
  if (values.region) {
    const brackets = ITP_BRACKETS_BY_REGION[values.region];
    if (brackets) {
      const lowestRatePct = brackets[0]!.ratePct;
      const highestRatePct = brackets.at(-1)!.ratePct;
      return {
        title: "Segunda mano: pagas ITP",
        message: `En tu comunidad autónoma el ITP no es un tipo único, sino tramos progresivos según el precio: del ${formatPct(lowestRatePct / 100)} % al ${formatPct(highestRatePct / 100)} %, según cuánto cueste la vivienda.`,
      };
    }

    const rate = ITP_RATE_BY_REGION[values.region];
    return {
      title: "Segunda mano: pagas ITP",
      message: `En tu comunidad autónoma el ITP general es del ${formatPct(rate)} %.`,
    };
  }

  return {
    title: "Segunda mano: pagas ITP",
    message: `El ITP varía según la comunidad autónoma; aquí usamos una media nacional del ${formatPct(DEFAULT_ITP_RATE)} % como estimación.`,
  };
}

function formatPct(rate: number): string {
  return (rate * 100).toString().replace(".", ",");
}

export function generateInsights(values: PurchaseCostsInputValues): Insight[] {
  const triggers = evaluatePurchaseCostsRules({ isNewConstruction: values.isNewConstruction });

  return triggers.map((trigger): Insight => {
    const copy =
      trigger.code === "new_construction_tax"
        ? NEW_CONSTRUCTION_COPY
        : trigger.code === "resale_transfer_tax"
          ? resaleTransferTaxCopy(values)
          : undefined;
    return {
      code: trigger.code,
      severity: trigger.severity,
      title: copy?.title ?? trigger.code,
      message: copy?.message ?? "",
    };
  });
}
