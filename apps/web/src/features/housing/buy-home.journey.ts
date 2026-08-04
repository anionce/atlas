import type { JourneyDefinition } from "@atlas/journey-engine";

import { REGION_OPTIONS } from "./region-options";

/**
 * El Journey se define mediante configuración, no código: no hay lógica
 * aquí, solo estructura (preguntas y validaciones). El cálculo vive en
 * @atlas/decision-engine.
 */
export const buyHomeJourney: JourneyDefinition = {
  id: "buy-home",
  title: { es: "Comprar una vivienda" },
  estimatedTimeMinutes: 3,
  steps: [
    {
      id: "monthlyIncome",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto ganas al mes?" },
      help: { es: "Ingresos netos aproximados, antes de descontar la hipoteca." },
      validation: { minimum: 0 },
    },
    {
      id: "savings",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto tienes ahorrado?" },
      help: { es: "Lo usamos para calcular la entrada y los gastos iniciales." },
      validation: { minimum: 0 },
    },
    {
      id: "monthlyDebts",
      type: "currency",
      required: false,
      label: { es: "¿Pagas alguna otra cuota al mes?" },
      help: { es: "Préstamos, coche, etc. Déjalo en blanco si no tienes ninguna." },
      validation: { minimum: 0 },
    },
    {
      id: "monthlySavingsCapacity",
      type: "currency",
      required: false,
      label: { es: "¿Cuánto podrías ahorrar cada mes a partir de ahora?" },
      help: { es: "Con esto podemos comparar comprar hoy frente a esperar y ahorrar más." },
      validation: { minimum: 0 },
    },
    {
      id: "interestRate",
      type: "percentage",
      required: true,
      label: { es: "¿Qué tipo de interés estás manejando?" },
      help: { es: "Si no lo sabes, 3 % es una referencia razonable ahora mismo." },
      validation: { minimum: 0, maximum: 15 },
    },
    {
      id: "mortgageYears",
      type: "number",
      required: true,
      label: { es: "¿A cuántos años quieres la hipoteca?" },
      validation: { minimum: 1, maximum: 40 },
    },
    {
      id: "isNewConstruction",
      type: "boolean",
      required: true,
      label: { es: "¿Es vivienda nueva?" },
      help: { es: "Cambia los impuestos de compra: IVA en obra nueva, ITP en segunda mano." },
    },
    {
      id: "region",
      type: "select",
      required: false,
      label: { es: "¿En qué comunidad autónoma?" },
      help: { es: "El ITP varía por comunidad; con este dato el cálculo es más preciso." },
      options: REGION_OPTIONS,
      dependsOn: { stepId: "isNewConstruction", equals: false },
    },
  ],
};
