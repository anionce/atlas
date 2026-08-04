export interface MortgageInput {
  /** Capital a financiar, en euros. */
  principal: number;
  /** Tipo de interés anual, en porcentaje (ej. 3.2 para 3,2 %). */
  annualInterestRatePct: number;
  /** Plazo del préstamo, en años. */
  years: number;
}

export interface MortgageResult {
  principal: number;
  years: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

/**
 * Cuota mensual de un préstamo con amortización francesa (cuota constante).
 * Función pura: no conoce React, no conoce la UI, no tiene efectos secundarios.
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { principal, annualInterestRatePct, years } = input;
  const monthlyRate = annualInterestRatePct / 100 / 12;
  const numPayments = years * 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / numPayments
      : (principal * (monthlyRate * (1 + monthlyRate) ** numPayments)) /
        ((1 + monthlyRate) ** numPayments - 1);

  const totalCost = monthlyPayment * numPayments;
  const totalInterest = totalCost - principal;

  return {
    principal,
    years,
    monthlyPayment,
    totalInterest,
    totalCost,
  };
}

/**
 * Inversa de {@link calculateMortgage}: dado el pago mensual máximo que alguien
 * puede asumir, calcula cuánto capital podría financiar.
 */
export function maxPrincipalForPayment(
  monthlyPayment: number,
  annualInterestRatePct: number,
  years: number,
): number {
  const monthlyRate = annualInterestRatePct / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) return monthlyPayment * numPayments;

  return (
    (monthlyPayment * ((1 + monthlyRate) ** numPayments - 1)) /
    (monthlyRate * (1 + monthlyRate) ** numPayments)
  );
}
