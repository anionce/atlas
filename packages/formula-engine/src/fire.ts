export interface FireNumberInput {
  monthlyExpenses: number;
  /** Regla del 4 % (Trinity study) por defecto: tu cartera cubre 25 veces tu gasto anual. */
  safeWithdrawalRatePct?: number;
}

const DEFAULT_SAFE_WITHDRAWAL_RATE_PCT = 4;

/**
 * Cuánto capital invertido necesitas para vivir de las rentas
 * indefinidamente, según la regla del retiro seguro. No calcula cuánto
 * tiempo tardas en llegar — eso es responsabilidad de
 * {@link import("./compound-interest").monthsToReachGoal}, que ya existe
 * y no hace falta duplicar.
 */
export function calculateFireNumber(input: FireNumberInput): number {
  const { monthlyExpenses, safeWithdrawalRatePct = DEFAULT_SAFE_WITHDRAWAL_RATE_PCT } = input;
  const annualExpenses = monthlyExpenses * 12;
  return annualExpenses / (safeWithdrawalRatePct / 100);
}
