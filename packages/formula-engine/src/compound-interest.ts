export interface CompoundInterestInput {
  initialAmount: number;
  monthlyContribution: number;
  annualReturnRatePct: number;
  years: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributed: number;
  totalInterestEarned: number;
}

/**
 * Valor futuro de un capital inicial más aportaciones mensuales constantes,
 * con interés compuesto mensual. Función pura.
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { initialAmount, monthlyContribution, annualReturnRatePct, years } = input;
  const monthlyRate = annualReturnRatePct / 100 / 12;
  const months = years * 12;

  const futureValueOfPrincipal =
    monthlyRate === 0 ? initialAmount : initialAmount * (1 + monthlyRate) ** months;

  const futureValueOfContributions =
    monthlyRate === 0
      ? monthlyContribution * months
      : (monthlyContribution * ((1 + monthlyRate) ** months - 1)) / monthlyRate;

  const finalBalance = futureValueOfPrincipal + futureValueOfContributions;
  const totalContributed = initialAmount + monthlyContribution * months;

  return {
    finalBalance,
    totalContributed,
    totalInterestEarned: finalBalance - totalContributed,
  };
}

/**
 * Inversa parcial de {@link calculateCompoundInterest}: cuántos meses hacen
 * falta, al ritmo de aportación actual, para alcanzar un objetivo de ahorro.
 * Devuelve `null` si, tal como está planteado, nunca se alcanza (aportación
 * cero y el capital inicial ya no crece lo suficiente).
 */
export function monthsToReachGoal(
  goalAmount: number,
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRatePct: number,
): number | null {
  if (initialAmount >= goalAmount) return 0;

  const monthlyRate = annualReturnRatePct / 100 / 12;

  if (monthlyRate === 0) {
    if (monthlyContribution <= 0) return null;
    return Math.ceil((goalAmount - initialAmount) / monthlyContribution);
  }

  const k = monthlyContribution / monthlyRate;
  const denominator = initialAmount + k;
  if (denominator <= 0) return null;

  const x = (goalAmount + k) / denominator;
  if (x <= 1) return 0;

  return Math.ceil(Math.log(x) / Math.log(1 + monthlyRate));
}
