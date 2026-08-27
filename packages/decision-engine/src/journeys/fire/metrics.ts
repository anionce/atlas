import {
  calculateCompoundInterest,
  calculateFireNumber,
  calculateFireNumberAfterTax,
  calculateFireNumberWithPension,
  estimateSpanishPublicPensionNetMonthly,
  monthsToReachGoal,
} from "@atlas/formula-engine";

import type { FireInputValues, FireMetrics } from "./types";

/**
 * Edad legal de jubilación ordinaria que asumimos para saber cuándo
 * empezaría a cobrarse la pensión pública. La edad real depende de los años
 * cotizados y está subiendo de forma transitoria desde 2013: en 2026 son 66
 * años y 10 meses (65 si se han cotizado 38 años y 3 meses o más), y llega a
 * 67 en 2027, cuando termina el periodo transitorio. Usamos 67 como
 * referencia porque es la edad final de la reforma y no depende de años
 * cotizados — un dato que esta calculadora no pregunta.
 */
export const ASSUMED_PUBLIC_PENSION_AGE = 67;

/**
 * Qué fracción de la cartera, en el momento de llegar al número FIRE, es
 * ganancia acumulada por interés compuesto en vez de aportación tuya. Solo
 * esa parte tributa al retirarla. `null` cuando FIRE no es alcanzable, ya
 * que entonces no hay un "momento FIRE" real del que partir.
 */
function computeGainFraction(values: FireInputValues, monthsToFire: number | null): number {
  if (monthsToFire === null || monthsToFire === 0) return 0;

  const accumulation = calculateCompoundInterest({
    initialAmount: values.currentInvestments ?? 0,
    monthlyContribution: values.monthlyContribution,
    annualReturnRatePct: values.annualReturnRate,
    years: monthsToFire / 12,
  });

  if (accumulation.finalBalance <= 0) return 0;
  return Math.max(0, accumulation.totalInterestEarned / accumulation.finalBalance);
}

interface ResolvedPension {
  amount: number;
  source: FireMetrics["pensionSource"];
}

/**
 * La pensión indicada directamente tiene prioridad — es más fiable que
 * cualquier estimación nuestra, porque viene del simulador oficial de la
 * Seguridad Social con tu historial real. Solo si no se indica, y hay
 * datos suficientes, se calcula una estimación automática (ver
 * `estimateSpanishPublicPensionNetMonthly`).
 */
function resolveMonthlyPension(
  values: FireInputValues,
  monthsToFire: number | null,
): ResolvedPension {
  if (values.monthlyPensionEstimate !== undefined && values.monthlyPensionEstimate > 0) {
    return { amount: values.monthlyPensionEstimate, source: "reported" };
  }

  if (
    values.currentGrossMonthlyIncome !== undefined &&
    values.yearsAlreadyContributed !== undefined
  ) {
    // Años que le quedan trabajando (y por tanto cotizando) hasta que
    // alcanza su número FIRE — no hasta la edad de jubilación, ya que a
    // partir de ahí, si de verdad deja de trabajar, deja de cotizar.
    const additionalYearsContributing = monthsToFire !== null ? monthsToFire / 12 : 0;
    const amount = estimateSpanishPublicPensionNetMonthly({
      currentGrossMonthlyIncome: values.currentGrossMonthlyIncome,
      yearsAlreadyContributed: values.yearsAlreadyContributed,
      additionalYearsContributing,
    });
    return { amount, source: "estimated" };
  }

  return { amount: 0, source: "none" };
}

export function computeMetrics(values: FireInputValues): FireMetrics {
  const currentInvestments = values.currentInvestments ?? 0;
  const fireNumber = calculateFireNumber({ monthlyExpenses: values.monthlyExpenses });

  const monthsToFire = monthsToReachGoal(
    fireNumber,
    currentInvestments,
    values.monthlyContribution,
    values.annualReturnRate,
  );

  const ageAtFire = monthsToFire !== null ? values.currentAge + monthsToFire / 12 : null;

  const gainFraction = computeGainFraction(values, monthsToFire);
  const fireNumberAfterTax = calculateFireNumberAfterTax({
    monthlyExpenses: values.monthlyExpenses,
    gainFraction,
  });

  const pension = resolveMonthlyPension(values, monthsToFire);
  const yearsUntilPensionAge = ageAtFire !== null ? ASSUMED_PUBLIC_PENSION_AGE - ageAtFire : 0;
  const fireNumberWithPension = calculateFireNumberWithPension({
    monthlyExpenses: values.monthlyExpenses,
    gainFraction,
    monthlyPensionEstimate: pension.amount,
    yearsUntilPensionAge,
    annualReturnRatePct: values.annualReturnRate,
  });

  return {
    fireNumber,
    fireNumberAfterTax,
    fireNumberWithPension,
    effectiveMonthlyPension: pension.amount,
    pensionSource: pension.source,
    reducedMonthlyExpensesAfterPension: Math.max(0, values.monthlyExpenses - pension.amount),
    monthsToFire,
    ageAtFire,
  };
}
