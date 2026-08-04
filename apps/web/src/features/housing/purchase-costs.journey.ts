import type { JourneyDefinition } from "@atlas/journey-engine";

import { REGION_OPTIONS } from "./region-options";

export const purchaseCostsJourney: JourneyDefinition = {
  id: "purchase-costs",
  title: { es: "Gastos de compra de una vivienda" },
  estimatedTimeMinutes: 1,
  steps: [
    {
      id: "propertyPrice",
      type: "currency",
      required: true,
      label: { es: "¿Cuál es el precio de la vivienda?" },
      validation: { minimum: 1 },
    },
    {
      id: "isNewConstruction",
      type: "boolean",
      required: true,
      label: { es: "¿Es vivienda nueva?" },
      help: { es: "Cambia los impuestos: IVA en obra nueva, ITP en segunda mano." },
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
