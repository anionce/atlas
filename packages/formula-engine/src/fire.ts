import { maxPrincipalForPayment } from "./mortgage";
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
  const grossAnnualWithdrawal = grossUpAnnualWithdrawalForTax(monthlyExpenses * 12, gainFraction);
  return grossAnnualWithdrawal / (safeWithdrawalRatePct / 100);
}

/**
 * Dado lo que quieres que te quede en el bolsillo cada año (`netAnnualTarget`)
 * después de que Hacienda se quede con su parte de la ganancia, calcula
 * cuánto tienes que retirar en bruto para lograrlo. Extraído de
 * {@link calculateFireNumberAfterTax} porque {@link calculateFireNumberWithPension}
 * también lo necesita, aplicado a un importe menor (el hueco hasta que
 * empieza a cobrarse la pensión) en vez de al gasto completo.
 */
function grossUpAnnualWithdrawalForTax(netAnnualTarget: number, gainFraction: number): number {
  if (netAnnualTarget <= 0) return 0;
  if (gainFraction <= 0) return netAnnualTarget;

  // Al 30 %, el tipo máximo actual, retirar el doble de lo que necesitas
  // siempre basta para cubrir el impuesto y quedarte con lo que buscas —
  // cota superior segura para la búsqueda.
  let low = netAnnualTarget;
  let high = netAnnualTarget * 2;

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const netAfterTax = mid - calculateSpanishSavingsTax(mid * gainFraction);
    if (netAfterTax < netAnnualTarget) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return high;
}

export interface FireNumberWithPensionInput extends FireNumberAfterTaxInput {
  /**
   * Estimación NETA (después de impuestos) de la pensión pública mensual
   * que esperas cobrar, en euros. La pensión pública tributa como
   * rendimiento del trabajo (escala general del IRPF, no la del ahorro que
   * usa esta calculadora para las retiradas de la cartera), así que en vez
   * de intentar modelar esa segunda escala fiscal completa —con mínimos
   * personales, otras rentas, etc.— le pedimos al usuario la cifra ya neta,
   * tal como se la daría el simulador oficial de la Seguridad Social.
   * `undefined` o `0` si no se espera pensión o no se ha indicado.
   */
  monthlyPensionEstimate?: number;
  /**
   * Años entre el momento de alcanzar el número FIRE y la edad legal de
   * jubilación, cuando empezaría a cobrarse la pensión. `0` o negativo si
   * la pensión ya estaría disponible desde el primer día.
   */
  yearsUntilPensionAge: number;
  /** Rentabilidad anual esperada de la cartera, en porcentaje. */
  annualReturnRatePct: number;
}

/**
 * Número FIRE que además tiene en cuenta la pensión pública española.
 *
 * Modela el retiro en dos fases en vez de tratarlo como una única retirada
 * constante para siempre:
 *
 * 1. **Fase puente** (de tu edad FIRE a la edad de jubilación): la pensión
 *    aún no ha empezado a cobrarse, así que la cartera tiene que cubrir el
 *    gasto completo. Solo hace falta financiar la parte que la pensión
 *    cubrirá más adelante —el resto ya está cubierto por el capital
 *    perpetuo del punto 2— y por un número finito de años, no para
 *    siempre, así que se calcula como una hipoteca inversa (cuánto capital
 *    hace falta hoy para poder retirar una cuota mensual durante N años),
 *    reutilizando {@link maxPrincipalForPayment}.
 * 2. **Fase con pensión** (desde la edad de jubilación en adelante): la
 *    pensión cubre parte del gasto, así que la cartera solo necesita
 *    sostener el hueco restante — un número FIRE perpetuo normal, pero
 *    sobre un gasto mensual menor.
 *
 * Cuando no se indica pensión, el hueco es 0 y el resultado coincide
 * exactamente con {@link calculateFireNumberAfterTax}.
 *
 * Es una aproximación adicional sobre la ya asumida en
 * `calculateFireNumberAfterTax`: asume que la edad de jubilación y el
 * importe de la pensión no cambian entre hoy y el momento de jubilarte
 * —algo que ninguna calculadora puede saber con décadas de antelación—, y
 * que la proporción aportación/ganancia de la cartera (`gainFraction`) es
 * la misma durante la fase puente que en el momento de llegar a FIRE.
 */
export function calculateFireNumberWithPension(input: FireNumberWithPensionInput): number {
  const {
    monthlyExpenses,
    gainFraction,
    safeWithdrawalRatePct = DEFAULT_SAFE_WITHDRAWAL_RATE_PCT,
    monthlyPensionEstimate = 0,
    yearsUntilPensionAge,
    annualReturnRatePct,
  } = input;

  const monthlyGapCoveredByPension = Math.min(monthlyExpenses, Math.max(0, monthlyPensionEstimate));
  const reducedMonthlyExpenses = monthlyExpenses - monthlyGapCoveredByPension;

  const perpetualCapital = calculateFireNumberAfterTax({
    monthlyExpenses: reducedMonthlyExpenses,
    gainFraction,
    safeWithdrawalRatePct,
  });

  if (monthlyGapCoveredByPension <= 0 || yearsUntilPensionAge <= 0) {
    return perpetualCapital;
  }

  const grossAnnualGap = grossUpAnnualWithdrawalForTax(
    monthlyGapCoveredByPension * 12,
    gainFraction,
  );
  const bridgeCapital = maxPrincipalForPayment(
    grossAnnualGap / 12,
    annualReturnRatePct,
    yearsUntilPensionAge,
  );

  return perpetualCapital + bridgeCapital;
}
