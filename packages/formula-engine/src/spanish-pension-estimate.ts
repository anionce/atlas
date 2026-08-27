import {
  calculateSpanishSavingsTax as calculateProgressiveTax,
  type SavingsTaxBracket,
} from "./spanish-savings-tax";

/**
 * Tope máximo de la base de cotización mensual en 2026: aunque cobres más,
 * la Seguridad Social solo calcula tu pensión como si cotizaras por esta
 * cantidad. Fuente: Instituto Santalucía, actualidad-pensiones.
 */
const MAX_MONTHLY_CONTRIBUTION_BASE_2026 = 5_101.2;

/**
 * Pensión máxima en 2026: 3.359,60 €/mes en 14 pagas (47.034,40 €/año). La
 * convertimos a un equivalente mensual sobre 12 pagas para que sea
 * comparable con el resto de esta calculadora, que trabaja siempre en
 * "gasto mensual medio" y no distingue pagas extra.
 */
const MAX_MONTHLY_PENSION_2026 = (3_359.6 * 14) / 12;

/**
 * Mínimo personal general (menor de 65 años, sin descendientes ni
 * discapacidad) que se resta de la base antes de aplicar la escala general
 * del IRPF. No representa tu caso exacto — si tienes más de 65 años o
 * familia a cargo, el mínimo real es mayor y pagarías menos impuesto del
 * que estimamos aquí.
 */
const GENERAL_PERSONAL_MINIMUM_ANNUAL_2026 = 5_550;

/**
 * Escala general del IRPF aproximada para 2026 (estatal + autonómica
 * media): la escala real varía por comunidad autónoma, algo que esta
 * calculadora no pregunta en este paso. Se usa solo para estimar a groso
 * modo cuánto se queda Hacienda de la pensión pública — no la retirada de
 * tu cartera, que ya usa la escala del ahorro (`SPANISH_SAVINGS_TAX_BRACKETS_2026`),
 * distinta de esta.
 */
export const SPANISH_GENERAL_TAX_BRACKETS_APPROX_2026: SavingsTaxBracket[] = [
  { upTo: 12_450, ratePct: 19 },
  { upTo: 20_200, ratePct: 24 },
  { upTo: 35_200, ratePct: 30 },
  { upTo: 60_000, ratePct: 37 },
  { upTo: 300_000, ratePct: 45 },
  { upTo: null, ratePct: 47 },
];

/**
 * Porcentaje (0-100) de la base reguladora que corresponde según los años
 * cotizados, con el calendario final de la reforma de 2013 (vigente desde
 * 2027): 50 % con 15 años, +0,21 %/mes durante los siguientes 49 meses
 * (hasta 19 años y 1 mes), +0,19 %/mes durante los 209 meses siguientes,
 * hasta el 100 % con 36 años y 6 meses. Por debajo de 15 años cotizados no
 * hay derecho a pensión contributiva de jubilación.
 */
function pensionPercentageForYearsContributed(totalYears: number): number {
  const totalMonths = Math.max(0, totalYears) * 12;
  const MIN_MONTHS_FOR_ANY_PENSION = 15 * 12;
  if (totalMonths < MIN_MONTHS_FOR_ANY_PENSION) return 0;

  const monthsBeyond15Years = totalMonths - MIN_MONTHS_FOR_ANY_PENSION;
  const tier1Months = Math.min(monthsBeyond15Years, 49);
  const tier2Months = Math.max(0, Math.min(monthsBeyond15Years - 49, 209));

  const percentage = 50 + tier1Months * 0.21 + tier2Months * 0.19;
  return Math.min(100, percentage);
}

export interface SpanishPensionEstimateInput {
  /**
   * Salario bruto mensual actual, en euros. Lo usamos como aproximación de
   * tu "base reguladora" (el real se calcula promediando un tramo de tu
   * historial de cotización, revalorizado a euros de hoy) — asume que tu
   * salario, en términos reales, se mantiene parecido el resto de tu vida
   * laboral. Es una simplificación grande: una carrera con subidas o
   * bajadas notables dará un resultado distinto al real.
   */
  currentGrossMonthlyIncome: number;
  /** Años que ya llevas cotizados a la Seguridad Social hasta hoy. */
  yearsAlreadyContributed: number;
  /**
   * Años adicionales que seguirás cotizando de aquí a que dejes de
   * trabajar. Para alguien que persigue FIRE esto normalmente es hasta que
   * alcanza su número FIRE, no hasta la edad de jubilación — a partir de
   * ahí ya no seguiría generando cotización, algo que reduce su pensión
   * futura frente a una carrera completa sin interrupciones.
   */
  additionalYearsContributing: number;
}

/**
 * Estima la pensión pública bruta mensual (equivalente en 12 pagas), a
 * partir de los años cotizados y el salario actual como proxy de la base
 * reguladora. Ver los caveats de {@link SpanishPensionEstimateInput} y del
 * módulo: es una aproximación gruesa, no un cálculo oficial.
 */
export function estimateSpanishPublicPensionGrossMonthly(
  input: SpanishPensionEstimateInput,
): number {
  const { currentGrossMonthlyIncome, yearsAlreadyContributed, additionalYearsContributing } = input;

  const cappedBase = Math.min(
    Math.max(0, currentGrossMonthlyIncome),
    MAX_MONTHLY_CONTRIBUTION_BASE_2026,
  );
  const totalYearsContributed =
    Math.max(0, yearsAlreadyContributed) + Math.max(0, additionalYearsContributing);
  const percentage = pensionPercentageForYearsContributed(totalYearsContributed);

  const gross = cappedBase * (percentage / 100);
  return Math.min(gross, MAX_MONTHLY_PENSION_2026);
}

/**
 * Igual que {@link estimateSpanishPublicPensionGrossMonthly}, pero
 * convertido a neto con la escala general aproximada del IRPF y el mínimo
 * personal general — la pensión pública tributa como rendimiento del
 * trabajo, con su propia escala, distinta de la del ahorro. No tiene en
 * cuenta la reducción adicional por rendimientos del trabajo ni tu
 * comunidad autónoma real, así que tiende a quedarse corta (estimación
 * conservadora: es más probable que cobres más neto que menos).
 */
export function estimateSpanishPublicPensionNetMonthly(input: SpanishPensionEstimateInput): number {
  const grossMonthly = estimateSpanishPublicPensionGrossMonthly(input);
  const grossAnnual = grossMonthly * 12;
  const taxableAnnual = Math.max(0, grossAnnual - GENERAL_PERSONAL_MINIMUM_ANNUAL_2026);
  const tax = calculateProgressiveTax(taxableAnnual, SPANISH_GENERAL_TAX_BRACKETS_APPROX_2026);
  const netAnnual = grossAnnual - tax;
  return netAnnual / 12;
}
