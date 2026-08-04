import { calculatePurchaseCosts } from "@atlas/formula-engine";

import type { PurchaseCostsInputValues, PurchaseCostsMetrics } from "./types";

export function computeMetrics(values: PurchaseCostsInputValues): PurchaseCostsMetrics {
  const breakdown = calculatePurchaseCosts(values);

  return {
    ...breakdown,
    totalPct: values.propertyPrice > 0 ? (breakdown.total / values.propertyPrice) * 100 : 0,
  };
}
