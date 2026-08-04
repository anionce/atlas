export interface PurchaseCostsInput {
  propertyPrice: number;
  /** Vivienda nueva (IVA + AJD) frente a segunda mano (ITP). */
  isNewConstruction: boolean;
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
 * Los porcentajes de ITP/IVA/AJD varían por Comunidad Autónoma; aquí usamos
 * una media razonable a nivel nacional. Notaría y registro son aranceles
 * regulados que dependen del precio, así que se acotan con un mínimo.
 */
export function calculatePurchaseCosts(input: PurchaseCostsInput): PurchaseCostsBreakdown {
  const { propertyPrice, isNewConstruction } = input;

  const transferTaxOrVat = isNewConstruction ? propertyPrice * 0.1 : propertyPrice * 0.07;
  const stampDuty = isNewConstruction ? propertyPrice * 0.015 : 0;
  const notary = Math.max(300, propertyPrice * 0.003);
  const registry = Math.max(200, propertyPrice * 0.002);
  const appraisal = 350;

  const total = transferTaxOrVat + stampDuty + notary + registry + appraisal;

  return { transferTaxOrVat, stampDuty, notary, registry, appraisal, total };
}
