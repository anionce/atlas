import type { JourneyDefinition } from "@atlas/journey-engine";

export const savingsRateJourney: JourneyDefinition = {
  id: "savings-rate",
  title: { es: "Calcula tu tasa de ahorro" },
  estimatedTimeMinutes: 1,
  steps: [
    {
      id: "monthlyIncome",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto ingresas al mes, en neto?" },
      validation: { minimum: 0 },
    },
    {
      id: "monthlyExpenses",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto gastas al mes?" },
      help: { es: "Todo lo que gastas: fijos, variables, ocio, todo." },
      validation: { minimum: 0 },
    },
    {
      id: "currentInvestments",
      type: "currency",
      required: false,
      label: { es: "¿Cuánto tienes ya invertido?" },
      help: { es: "Déjalo en blanco si vas a empezar de cero." },
      validation: { minimum: 0 },
    },
    {
      id: "annualReturnRate",
      type: "percentage",
      required: true,
      label: { es: "¿Qué rentabilidad anual esperas de tus inversiones?" },
      help: {
        es: "Si no lo sabes, 6-7 % es razonable a largo plazo para una cartera diversificada.",
      },
      validation: { minimum: 0, maximum: 20 },
    },
  ],
};
