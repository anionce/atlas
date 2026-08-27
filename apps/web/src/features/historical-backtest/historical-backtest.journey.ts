import type { JourneyDefinition } from "@atlas/journey-engine";

import { WITHDRAWAL_STRATEGY_OPTIONS } from "./withdrawal-strategy-options";

export const historicalBacktestJourney: JourneyDefinition = {
  id: "historical-backtest",
  title: { es: "Simulador histórico de jubilación" },
  estimatedTimeMinutes: 2,
  steps: [
    {
      id: "initialPortfolio",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto tienes invertido?" },
      validation: { minimum: 0 },
    },
    {
      id: "monthlyExpenses",
      type: "currency",
      required: true,
      label: { es: "¿Cuánto necesitas al mes para vivir?" },
      validation: { minimum: 0 },
    },
    {
      id: "stockAllocationPct",
      type: "percentage",
      required: true,
      label: { es: "¿Qué porcentaje de tu cartera está en renta variable (acciones)?" },
      help: { es: "El resto se asume en bonos. Si no lo sabes, 80 % es una referencia habitual." },
      validation: { minimum: 0, maximum: 100 },
    },
    {
      id: "years",
      type: "number",
      required: true,
      label: { es: "¿Cuántos años tiene que durar tu cartera?" },
      help: { es: "Desde que empiezas a retirar hasta el final de tu jubilación." },
      validation: { minimum: 5, maximum: 60 },
    },
    {
      id: "withdrawalStrategyId",
      type: "select",
      required: true,
      label: { es: "¿Qué estrategia de retirada quieres simular?" },
      help: {
        es: "Si no lo sabes, empieza por la regla del 4 % clásica — es la más simple y la más conocida.",
      },
      options: WITHDRAWAL_STRATEGY_OPTIONS,
    },
  ],
};
