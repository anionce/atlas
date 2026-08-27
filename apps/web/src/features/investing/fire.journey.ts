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
    {
      id: "knowsPensionEstimate",
      type: "boolean",
      required: false,
      label: { es: "¿Ya sabes cuánto vas a cobrar de pensión pública al mes?" },
      help: {
        es: "Opcional: si lo dejas sin responder, seguimos sin contar con ninguna pensión pública en el cálculo.",
      },
    },
    {
      id: "monthlyPensionEstimate",
      type: "currency",
      required: false,
      label: { es: "¿Cuánto esperas cobrar de pensión pública al mes, en neto?" },
      help: {
        es: "Para una cifra fiable, usa el simulador oficial de Tu Seguridad Social — nosotros solo la restamos de tus gastos a partir de la edad legal de jubilación.",
      },
      validation: { minimum: 0 },
      dependsOn: { stepId: "knowsPensionEstimate", equals: true },
    },
    {
      id: "currentGrossMonthlyIncome",
      type: "currency",
      required: false,
      label: { es: "¿Cuál es tu salario bruto mensual actual?" },
      help: {
        es: "Con esto y tus años cotizados hacemos una estimación muy aproximada de tu futura pensión — no somos la Seguridad Social, así que trátala solo como orientación.",
      },
      validation: { minimum: 0 },
      dependsOn: { stepId: "knowsPensionEstimate", equals: false },
    },
    {
      id: "yearsAlreadyContributed",
      type: "number",
      required: false,
      label: { es: "¿Cuántos años llevas ya cotizados a la Seguridad Social?" },
      validation: { minimum: 0, maximum: 60 },
      dependsOn: { stepId: "knowsPensionEstimate", equals: false },
    },
  ],
};
