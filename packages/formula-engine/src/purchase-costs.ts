import { DEFAULT_ITP_RATE, ITP_RATE_BY_REGION, type SpanishRegion } from "./spanish-regions";

export interface PurchaseCostsInput {
  propertyPrice: number;
  /** Vivienda nueva (IVA + AJD) frente a segunda mano (ITP). */
  isNewConstruction: boolean;
  /** Comunidad Autónoma donde está la vivienda; determina el tipo de ITP en segunda mano. */
  region?: SpanishRegion;
}

export interface PurchaseCostsBreakdown {
  /** ITP (segunda mano) o IVA (obra nueva). */
  transferTaxOrVat: number;
  /** AJD, solo aplica en obra nueva en este modelo simplificado. */
  stampDuty: number;
  notary: number;
  registry: number;
  appraisal: number;
  total: number;
}

/**
 * Estimación simplificada de los gastos de compra de una vivienda en España.
 *
 * El IVA de obra nueva es una media nacional (10 %); el ITP de segunda mano
 * usa el tipo general de la Comunidad Autónoma indicada, o la media nacional
 * si no se indica ninguna. Notaría y registro son aranceles regulados que
 * dependen del precio, así que se acotan con un mínimo.
 */
export function calculatePurchaseCosts(input: PurchaseCostsInput): PurchaseCostsBreakdown {
  const { propertyPrice, isNewConstruction, region } = input;

  const itpRate = region ? ITP_RATE_BY_REGION[region] : DEFAULT_ITP_RATE;
  const transferTaxOrVat = isNewConstruction ? propertyPrice * 0.1 : propertyPrice * itpRate;
  const stampDuty = isNewConstruction ? propertyPrice * 0.015 : 0;
  const notary = Math.max(300, propertyPrice * 0.003);
  const registry = Math.max(200, propertyPrice * 0.002);
  const appraisal = 350;

  const total = transferTaxOrVat + stampDuty + notary + registry + appraisal;

  return { transferTaxOrVat, stampDuty, notary, registry, appraisal, total };
}
