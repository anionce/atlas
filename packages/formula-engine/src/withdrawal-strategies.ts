import type { WithdrawalStrategy } from "./historical-backtest";

/**
 * "Percent of Portfolio": retira cada año un porcentaje fijo del balance
 * actual de la cartera, en vez de un importe fijo ajustado por inflación.
 * Como el importe siempre es un porcentaje de lo que queda, la cartera
 * nunca llega exactamente a cero por esta vía — a cambio, el gasto
 * disponible sube y baja con el mercado, año a año, sin ningún suelo.
 */
export function createPercentOfPortfolioStrategy(withdrawalRatePct: number): WithdrawalStrategy {
  return (context) => context.portfolioBalance * (withdrawalRatePct / 100);
}

/**
 * "1/N": reparte el balance actual entre los años que quedan de
 * jubilación. El último año retira la cartera entera — por diseño, se
 * agota (o casi) exactamente al final, ni antes ni después. No asume
 * ninguna rentabilidad futura, a diferencia de VPW.
 */
export function createOneOverNStrategy(totalYears: number): WithdrawalStrategy {
  return (context) => {
    const yearsRemaining = totalYears - context.yearIndex;
    if (yearsRemaining <= 0) return context.portfolioBalance;
    return context.portfolioBalance / yearsRemaining;
  };
}

/**
 * "Variable Percentage Withdrawal" (VPW, Bogleheads): como 1/N, pero en
 * vez de repartir el balance a partes iguales entre los años que quedan,
 * usa una fórmula de anualidad — de la misma familia que la de
 * `calculateMortgage`, aunque con la convención de pago ajustada, ya que
 * aquí se retira al empezar el año en vez de al terminarlo — para tener en
 * cuenta que ese dinero seguirá creciendo mientras se va retirando. Con
 * rentabilidad esperada 0%, VPW coincide exactamente con 1/N; con
 * rentabilidad positiva, VPW retira más que 1/N para el mismo punto de la
 * jubilación, porque "adelanta" el crecimiento que espera de lo que queda.
 *
 * El VPW real de Bogleheads liga el porcentaje a tu edad concreta y a una
 * edad final (normalmente 99 años); aquí se simplifica a "años que quedan
 * de jubilación" en vez de edad biológica — para esta calculadora, ambas
 * cosas son la misma información expresada de otra forma, ya que la
 * duración de la jubilación ya fija cuántos años tiene que durar el dinero.
 */
export function createVpwStrategy(
  totalYears: number,
  expectedReturnPct: number,
): WithdrawalStrategy {
  return (context) => {
    const yearsRemaining = totalYears - context.yearIndex;
    if (yearsRemaining <= 0) return context.portfolioBalance;

    const r = expectedReturnPct / 100;
    if (r === 0) return context.portfolioBalance / yearsRemaining;

    // Factor de anualidad ajustado a la convención de este motor —retira
    // primero, luego crece el resto durante ese mismo año—, no a la
    // convención de "cobra al final del año" que usan la mayoría de
    // fórmulas de anualidad de manual (incluida `calculateMortgage`).
    const annuityFactor = (r * (1 + r) ** (yearsRemaining - 1)) / ((1 + r) ** yearsRemaining - 1);
    // En el último año el factor vale 1 en teoría, pero con algunas
    // rentabilidades el redondeo de coma flotante lo deja en 1,0000000000000007
    // y retiraría unos céntimos más que el saldo: la cartera quedaría en
    // negativo y la ventana contaría como fracaso aunque VPW agote el saldo
    // justo al final, por diseño. Nunca se retira más de lo que hay.
    return Math.min(context.portfolioBalance * annuityFactor, context.portfolioBalance);
  };
}

/**
 * Guyton-Klinger: parte de Constant Dollar (retirada fija ajustada por
 * inflación) y le añade dos "guardarraíles" que reaccionan a cómo le va a
 * la cartera, siguiendo las reglas originales de Guyton y Klinger (2006):
 *
 * - Regla de gestión de cartera: si el año anterior la cartera perdió
 *   valor, ese año no se ajusta la retirada por inflación (se congela).
 * - Regla de preservación de capital: si la retirada resultante supondría
 *   una tasa sobre la cartera actual más de un 20% por encima de la tasa
 *   inicial, se recorta un 10%.
 * - Regla de prosperidad: si esa tasa cae más de un 20% por debajo de la
 *   inicial, se sube un 10% — te lo puedes permitir.
 *
 * Simplificación respecto al método original: los guardarraíles se aplican
 * todos los años; Guyton y Klinger dejaban de aplicar la preservación de
 * capital en los últimos ~15 años de la jubilación, algo que no modelamos
 * aquí.
 */
export function createGuytonKlingerStrategy(): WithdrawalStrategy {
  const GUARDRAIL_BAND = 0.2;
  const GUARDRAIL_ADJUSTMENT = 0.1;

  return (context) => {
    if (context.yearIndex === 0) return context.initialWithdrawal;

    const frozen = context.previousYearPortfolioReturnPct < 0;
    let candidate = frozen
      ? context.previousWithdrawal
      : context.previousWithdrawal * (1 + context.previousYearInflationPct / 100);

    if (context.portfolioBalance <= 0) return candidate;

    const initialRatePct = (context.initialWithdrawal / context.initialPortfolioBalance) * 100;
    const currentRatePct = (candidate / context.portfolioBalance) * 100;

    if (currentRatePct > initialRatePct * (1 + GUARDRAIL_BAND)) {
      candidate *= 1 - GUARDRAIL_ADJUSTMENT;
    } else if (currentRatePct < initialRatePct * (1 - GUARDRAIL_BAND)) {
      candidate *= 1 + GUARDRAIL_ADJUSTMENT;
    }

    return candidate;
  };
}
