import type { JourneyDefinition } from "@atlas/journey-engine";

export const compoundInterestJourney: JourneyDefinition = {
  id: "compound-interest",
  title: { es: "Ahorrar con interés compuesto" },
  estimatedTimeMinutes: 2,
  steps: [
    {
      id: "initialAmount",
      type: "currency",
      required: false,
      label: { es: "¿Cuánto tienes ahorrado ya?" },
      help: { es: "Déjalo en blanco si vas a empezar de cero." },
      validation: { minimum: 0 },
    },
    {
      id: "monthlyContribution",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto puedes ahorrar cada mes?" },
      validation: { minimum: 0 },
    },
    {
      id: "annualReturnRate",
      type: "percentage",
      required: true,
      label: { es: "¿Qué rentabilidad anual esperas?" },
      help: { es: "Si no lo sabes, 5-7 % es razonable para un fondo indexado a largo plazo." },
      validation: { minimum: 0, maximum: 20 },
    },
    {
      id: "years",
      type: "number",
      required: true,
      label: { es: "¿Durante cuántos años quieres ahorrar?" },
      validation: { minimum: 1, maximum: 60 },
    },
    {
      id: "goalAmount",
      type: "currency",
      required: false,
      label: { es: "¿Tienes un objetivo de ahorro en mente?" },
      help: { es: "Déjalo en blanco si solo quieres ver cómo crece tu ahorro." },
      validation: { minimum: 0 },
    },
  ],
};
