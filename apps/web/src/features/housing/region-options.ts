import type { StepOption } from "@atlas/journey-engine";

/**
 * Slugs alineados 1:1 con SpanishRegion en @atlas/formula-engine (no
 * importado directamente para no añadir esa dependencia solo por esto).
 */
export const REGION_OPTIONS: StepOption[] = [
  { value: "andalucia", label: { es: "Andalucía" } },
  { value: "aragon", label: { es: "Aragón" } },
  { value: "asturias", label: { es: "Asturias" } },
  { value: "canarias", label: { es: "Canarias" } },
  { value: "cantabria", label: { es: "Cantabria" } },
  { value: "castilla-la-mancha", label: { es: "Castilla-La Mancha" } },
  { value: "castilla-y-leon", label: { es: "Castilla y León" } },
  { value: "cataluna", label: { es: "Cataluña" } },
  { value: "ceuta", label: { es: "Ceuta" } },
  { value: "madrid", label: { es: "Comunidad de Madrid" } },
  { value: "navarra", label: { es: "Comunidad Foral de Navarra" } },
  { value: "comunidad-valenciana", label: { es: "Comunidad Valenciana" } },
  { value: "extremadura", label: { es: "Extremadura" } },
  { value: "galicia", label: { es: "Galicia" } },
  { value: "baleares", label: { es: "Islas Baleares" } },
  { value: "la-rioja", label: { es: "La Rioja" } },
  { value: "melilla", label: { es: "Melilla" } },
  { value: "pais-vasco", label: { es: "País Vasco" } },
  { value: "murcia", label: { es: "Región de Murcia" } },
];
