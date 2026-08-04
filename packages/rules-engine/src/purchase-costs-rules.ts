import type { RuleTrigger } from "./types";

export interface PurchaseCostsRulesInput {
  isNewConstruction: boolean;
}

/**
 * No es una regla de negocio en el sentido de "algo va bien o mal": es
 * puramente explicativa (por qué se aplica IVA o ITP). La incluimos como
 * regla igualmente para que el Insight Generator del Journey no tenga
 * lógica de negocio incrustada — solo traduce el código a texto.
 */
export function evaluatePurchaseCostsRules({
  isNewConstruction,
}: PurchaseCostsRulesInput): RuleTrigger[] {
  return [
    {
      code: isNewConstruction ? "new_construction_tax" : "resale_transfer_tax",
      severity: "info",
    },
  ];
}
