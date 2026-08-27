import type {
  HistoricalBacktestDecisionInput,
  HistoricalBacktestInputValues,
  WithdrawalStrategyId,
} from "@atlas/decision-engine";

/** Traduce las respuestas sueltas del Journey al contrato tipado del Decision Engine. */
export function toDecisionInput(answers: Record<string, unknown>): HistoricalBacktestDecisionInput {
  const values: HistoricalBacktestInputValues = {
    initialPortfolio: Number(answers.initialPortfolio),
    monthlyExpenses: Number(answers.monthlyExpenses),
    stockAllocationPct: Number(answers.stockAllocationPct),
    years: Number(answers.years),
    withdrawalStrategyId: answers.withdrawalStrategyId as WithdrawalStrategyId,
  };

  return {
    journeyId: "historical-backtest",
    version: "1.0.0",
    locale: "es",
    values,
  };
}
