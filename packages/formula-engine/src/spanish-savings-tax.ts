export interface SavingsTaxBracket {
  /** Límite superior del tramo, en euros. `null` = sin límite (último tramo). */
  upTo: number | null;
  ratePct: number;
}

/**
 * Tramos de la base del ahorro del IRPF para 2026, territorio común
 * (Ley 7/2024). Los territorios forales (País Vasco, Navarra) aplican su
 * propia escala, distinta de esta.
 */
export const SPANISH_SAVINGS_TAX_BRACKETS_2026: SavingsTaxBracket[] = [
  { upTo: 6_000, ratePct: 19 },
  { upTo: 50_000, ratePct: 21 },
  { upTo: 200_000, ratePct: 23 },
  { upTo: 300_000, ratePct: 27 },
  { upTo: null, ratePct: 30 },
];

/**
 * Cuota íntegra sobre un importe de la base del ahorro (intereses,
 * dividendos, ganancias patrimoniales), aplicando los tramos de forma
 * progresiva: cada tramo tributa solo por la parte del importe que cae
 * dentro de él, no el importe entero al tipo del tramo más alto alcanzado.
 */
export function calculateSpanishSavingsTax(
  taxableAmount: number,
  brackets: SavingsTaxBracket[] = SPANISH_SAVINGS_TAX_BRACKETS_2026,
): number {
  if (taxableAmount <= 0) return 0;

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const limit = bracket.upTo ?? Infinity;
    const amountInBracket = Math.max(0, Math.min(taxableAmount, limit) - previousLimit);
    tax += amountInBracket * (bracket.ratePct / 100);
    previousLimit = limit;
    if (taxableAmount <= limit) break;
  }

  return tax;
}
