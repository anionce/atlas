import { calculateSpanishSavingsTax } from "./spanish-savings-tax";

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

export interface FireNumberAfterTaxInput extends FireNumberInput {
  /**
   * Qué fracción (0-1) de la cartera, en el momento de llegar a FIRE, es
   * ganancia acumulada en vez de aportación tuya. Solo la parte de
   * ganancia tributa al retirarla — la que ya era tuya, no.
   */
  gainFraction: number;
}

/**
 * Número FIRE ajustado por el IRPF español sobre la parte de ganancia de
 * cada retirada: la regla del 4 % simple asume que te gastas el 100 % de
 * lo que retiras, pero Hacienda se queda con parte de la ganancia antes de
 * que llegue a tu bolsillo, así que en realidad hace falta más capital.
 *
 * Es una aproximación, no un cálculo fiscal exacto: asume que la
 * proporción aportación/ganancia de la cartera se mantiene constante
 * durante toda la fase de retirada (en la práctica varía retirada a
 * retirada), y no tiene en cuenta el método de venta FIFO/FEFO real ni
 * compensación de pérdidas de otros años — cosas que dependen de tu
 * historial de compras concreto, que esta calculadora no conoce.
 *
 * Resuelve numéricamente (búsqueda binaria) en vez de despejar la fórmula
 * a mano, porque los tramos progresivos hacen que la retirada bruta
 * necesaria no tenga una fórmula cerrada simple.
 */
export function calculateFireNumberAfterTax(input: FireNumberAfterTaxInput): number {
  const {
    monthlyExpenses,
    gainFraction,
    safeWithdrawalRatePct = DEFAULT_SAFE_WITHDRAWAL_RATE_PCT,
  } = input;
  const annualExpenses = monthlyExpenses * 12;

  if (gainFraction <= 0) {
    return calculateFireNumber({ monthlyExpenses, safeWithdrawalRatePct });
  }

  // Al 30 %, el tipo máximo actual, retirar el doble de tus gastos siempre
  // basta para cubrir el impuesto y quedarte con lo que necesitas — cota
  // superior segura para la búsqueda.
  let low = annualExpenses;
  let high = annualExpenses * 2;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const netAfterTax = mid - calculateSpanishSavingsTax(mid * gainFraction);
    if (netAfterTax < annualExpenses) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const grossAnnualWithdrawal = high;
  return grossAnnualWithdrawal / (safeWithdrawalRatePct / 100);
}
