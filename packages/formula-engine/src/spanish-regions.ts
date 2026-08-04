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
 * Cada región tiene además tipos reducidos según el perfil del comprador
 * (jóvenes, familia numerosa, VPO...) que este modelo no contempla: es el
 * tipo general, no el que pagaría cada comprador concreto. Contrastado
 * contra dos fuentes independientes en 2026; revisar periódicamente, ya
 * que cada Comunidad puede cambiarlo por ley autonómica.
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
  murcia: 0.08,
  navarra: 0.06,
  "pais-vasco": 0.04,
  "la-rioja": 0.07,
  ceuta: 0.06,
  melilla: 0.06,
};

/** Media nacional aproximada, usada cuando no se conoce la Comunidad Autónoma. */
export const DEFAULT_ITP_RATE = 0.07;
