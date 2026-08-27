import type { SpanishRegion } from "./spanish-regions";

export interface ItpBracket {
  /** Límite superior del tramo, en euros. `null` = sin límite (último tramo). */
  upTo: number | null;
  ratePct: number;
}

/**
 * Comunidades cuyo ITP para vivienda usada no es un tipo único sino tramos
 * progresivos según el precio de la vivienda — cada tramo tributa solo por
 * la parte del precio que cae dentro de él, igual que el IRPF (confirmado
 * explícitamente así para Cataluña y Asturias, con ejemplos oficiales de
 * cálculo; se asume el mismo modelo para el resto, ya que usan el mismo
 * lenguaje de "tramos progresivos" en la normativa correspondiente).
 *
 * Última verificación: agosto 2026. El resto de comunidades en
 * `ITP_RATE_BY_REGION` usan un tipo único y no tienen entrada aquí.
 */
export const ITP_BRACKETS_BY_REGION: Partial<Record<SpanishRegion, ItpBracket[]>> = {
  cataluna: [
    { upTo: 600_000, ratePct: 10 },
    { upTo: 900_000, ratePct: 11 },
    { upTo: 1_500_000, ratePct: 12 },
    { upTo: null, ratePct: 13 },
  ],
  asturias: [
    { upTo: 300_000, ratePct: 8 },
    { upTo: 500_000, ratePct: 9 },
    { upTo: null, ratePct: 10 },
  ],
  extremadura: [
    { upTo: 360_000, ratePct: 8 },
    { upTo: 600_000, ratePct: 10 },
    { upTo: null, ratePct: 11 },
  ],
  baleares: [
    { upTo: 400_000, ratePct: 8 },
    { upTo: 600_000, ratePct: 9 },
    { upTo: 1_000_000, ratePct: 10 },
    { upTo: 2_000_000, ratePct: 12 },
    { upTo: null, ratePct: 13 },
  ],
  "comunidad-valenciana": [
    { upTo: 1_000_000, ratePct: 9 },
    { upTo: null, ratePct: 11 },
  ],
};

/**
 * ITP de una vivienda en una comunidad con tramos progresivos: cada tramo
 * tributa solo por la parte del precio que cae dentro de él, no el precio
 * entero al tipo del tramo más alto alcanzado (misma lógica que
 * `calculateSpanishSavingsTax`, aplicada aquí al precio de la vivienda en
 * vez de a la base del ahorro).
 */
export function calculateItpProgressive(propertyPrice: number, brackets: ItpBracket[]): number {
  if (propertyPrice <= 0) return 0;

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const limit = bracket.upTo ?? Infinity;
    const amountInBracket = Math.max(0, Math.min(propertyPrice, limit) - previousLimit);
    tax += amountInBracket * (bracket.ratePct / 100);
    previousLimit = limit;
    if (propertyPrice <= limit) break;
  }

  return tax;
}
