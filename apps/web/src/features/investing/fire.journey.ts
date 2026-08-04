import type { JourneyDefinition } from "@atlas/journey-engine";

export const fireJourney: JourneyDefinition = {
  id: "fire",
  title: { es: "Calcula tu independencia financiera (FIRE)" },
  estimatedTimeMinutes: 2,
  steps: [
    {
      id: "currentAge",
      type: "number",
      required: true,
      label: { es: "¿Cuántos años tienes?" },
      validation: { minimum: 18, maximum: 100 },
    },
    {
      id: "currentInvestments",
      type: "currency",
      required: false,
      label: { es: "¿Cuánto tienes invertido ya?" },
      help: { es: "Déjalo en blanco si vas a empezar de cero." },
      validation: { minimum: 0 },
    },
    {
      id: "monthlyContribution",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto puedes invertir cada mes?" },
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
    {
      id: "monthlyExpenses",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto necesitas al mes para vivir cómodamente?" },
      help: { es: "Lo usamos para calcular cuánto capital necesitarías para vivir de las rentas." },
      validation: { minimum: 0 },
    },
  ],
};
