import type { StepOption } from "@atlas/journey-engine";

/** Valores alineados 1:1 con WithdrawalStrategyId en @atlas/decision-engine. */
export const WITHDRAWAL_STRATEGY_OPTIONS: StepOption[] = [
  { value: "constantDollar", label: { es: "Regla del 4 % clásica (retirada fija)" } },
  { value: "guytonKlinger", label: { es: "Guyton-Klinger (con guardarraíles)" } },
  { value: "percentOfPortfolio", label: { es: "Porcentaje fijo de la cartera" } },
  { value: "oneOverN", label: { es: "1/N (reparto entre los años que quedan)" } },
  { value: "vpw", label: { es: "VPW (retirada porcentual variable)" } },
];
