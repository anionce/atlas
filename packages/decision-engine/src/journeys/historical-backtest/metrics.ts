import {
  calculateAverageHistoricalReturn,
  calculateHistoricalBacktest,
  constantDollarStrategy,
  createGuytonKlingerStrategy,
  createOneOverNStrategy,
  createPercentOfPortfolioStrategy,
  createVpwStrategy,
  type WithdrawalStrategy,
} from "@atlas/formula-engine";

import type {
  HistoricalBacktestInputValues,
  HistoricalBacktestMetrics,
  WithdrawalStrategyId,
} from "./types";

/**
 * Traduce el id de estrategia elegido en el Journey a la función real de
 * `formula-engine`. Percent of Portfolio y VPW necesitan un parámetro que
 * no se le pregunta a quien usa la calculadora —la tasa de retirada y la
 * rentabilidad esperada, respectivamente— porque ya se pueden derivar de
 * las otras respuestas (gasto/cartera inicial, y la asignación elegida).
 */
function buildStrategy(
  id: WithdrawalStrategyId,
  values: HistoricalBacktestInputValues,
  withdrawalRatePct: number,
): WithdrawalStrategy {
  switch (id) {
    case "constantDollar":
      return constantDollarStrategy;
    case "percentOfPortfolio":
      return createPercentOfPortfolioStrategy(withdrawalRatePct);
    case "oneOverN":
      return createOneOverNStrategy(values.years);
    case "vpw":
      return createVpwStrategy(
        values.years,
        calculateAverageHistoricalReturn(values.stockAllocationPct),
      );
    case "guytonKlinger":
      return createGuytonKlingerStrategy();
  }
}

export function computeMetrics(values: HistoricalBacktestInputValues): HistoricalBacktestMetrics {
  const annualWithdrawal = values.monthlyExpenses * 12;
  const withdrawalRatePct =
    values.initialPortfolio > 0 ? (annualWithdrawal / values.initialPortfolio) * 100 : 0;

  const strategy = buildStrategy(values.withdrawalStrategyId, values, withdrawalRatePct);

  const result = calculateHistoricalBacktest({
    initialPortfolio: values.initialPortfolio,
    initialAnnualWithdrawal: annualWithdrawal,
    stockAllocationPct: values.stockAllocationPct,
    years: values.years,
    strategy,
  });

  return {
    successRatePct: result.successRatePct,
    successCount: result.successCount,
    totalSimulations: result.totalSimulations,
    simulations: result.simulations.map((s) => ({
      startYear: s.startYear,
      endYear: s.endYear,
      success: s.success,
      endingBalance: s.endingBalance,
    })),
    withdrawalRatePct,
  };
}
