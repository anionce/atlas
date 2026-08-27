export type WithdrawalStrategyId =
  "constantDollar" | "percentOfPortfolio" | "oneOverN" | "vpw" | "guytonKlinger";

export interface HistoricalBacktestInputValues {
  initialPortfolio: number;
  /** Gasto mensual que necesitarías cubrir con la cartera. */
  monthlyExpenses: number;
  /** % de la cartera en renta variable (acciones); el resto va a bonos. */
  stockAllocationPct: number;
  /** Duración de la jubilación, en años. */
  years: number;
  withdrawalStrategyId: WithdrawalStrategyId;
}

export interface HistoricalBacktestDecisionInput {
  journeyId: "historical-backtest";
  version: string;
  locale: "es";
  values: HistoricalBacktestInputValues;
}

export interface HistoricalBacktestSimulationSummary {
  startYear: number;
  endYear: number;
  success: boolean;
  endingBalance: number;
}

export interface HistoricalBacktestMetrics {
  /** % de las ventanas históricas posibles en las que el dinero no se agotó. */
  successRatePct: number;
  successCount: number;
  totalSimulations: number;
  /** Resumen de cada ventana histórica simulada, para mostrarlas todas. */
  simulations: HistoricalBacktestSimulationSummary[];
  /** Retirada anual del primer año, como % de la cartera inicial. */
  withdrawalRatePct: number;
}
