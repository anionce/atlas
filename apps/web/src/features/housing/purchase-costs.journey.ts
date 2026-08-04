import type { JourneyDefinition } from "@atlas/journey-engine";

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
  ],
};
