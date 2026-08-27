export type SpanishRegion =
  | "andalucia"
  | "aragon"
  | "asturias"
  | "baleares"
  | "canarias"
  | "cantabria"
  | "castilla-la-mancha"
  | "castilla-y-leon"
  | "cataluna"
  | "comunidad-valenciana"
  | "extremadura"
  | "galicia"
  | "madrid"
  | "murcia"
  | "navarra"
  | "pais-vasco"
  | "la-rioja"
  | "ceuta"
  | "melilla";

/**
 * Tipo general de ITP para vivienda usada, por Comunidad Autónoma.
 *
 * Esta tabla da el tipo de un único tramo. Cataluña, Asturias, Extremadura,
 * Baleares y Comunidad Valenciana en realidad tienen tramos progresivos
 * según el precio de la vivienda (cada tramo tributa solo por su parte,
 * como el IRPF) — para esas cinco comunidades, `calculatePurchaseCosts` usa
 * `ITP_BRACKETS_BY_REGION` en vez de esta tabla; los valores de aquí quedan
 * solo como referencia informativa (el tipo de su primer tramo).
 *
 * Simplificación que sigue sin modelar: cada región tiene además tipos
 * reducidos según el perfil del comprador (jóvenes, familia numerosa,
 * VPO...); este modelo usa siempre el tipo general, no el que pagaría cada
 * comprador concreto.
 *
 * Última verificación: agosto 2026 (corregido el tipo de Murcia, que bajó
 * de 8 % a 7,75 % en julio de 2025 por la Ley 3/2025; añadidos los tramos
 * progresivos de las cinco comunidades que los tienen). Revisar
 * periódicamente: cada Comunidad puede cambiarlo por ley autonómica.
 *
 * Para obra nueva seguimos usando el IVA nacional (10 %), que es uniforme
 * salvo en Canarias (IGIC) y los regímenes forales — esa excepción no está
 * modelada todavía.
 */
export const ITP_RATE_BY_REGION: Record<SpanishRegion, number> = {
  andalucia: 0.07,
  aragon: 0.08,
  asturias: 0.08,
  baleares: 0.08,
  canarias: 0.065,
  cantabria: 0.09,
  "castilla-la-mancha": 0.09,
  "castilla-y-leon": 0.08,
  cataluna: 0.1,
  "comunidad-valenciana": 0.09,
  extremadura: 0.08,
  galicia: 0.08,
  madrid: 0.06,
  murcia: 0.0775,
  navarra: 0.06,
  "pais-vasco": 0.04,
  "la-rioja": 0.07,
  ceuta: 0.06,
  melilla: 0.06,
};

/** Media nacional aproximada, usada cuando no se conoce la Comunidad Autónoma. */
export const DEFAULT_ITP_RATE = 0.07;
