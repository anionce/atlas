import { DecisionValidationError } from "../../errors";
import type { DecisionError } from "../../shared-types";
import type { HistoricalBacktestInputValues, WithdrawalStrategyId } from "./types";

const MAX_YEARS = 60;
const MIN_YEARS = 5;
const VALID_STRATEGY_IDS: WithdrawalStrategyId[] = [
  "constantDollar",
  "percentOfPortfolio",
  "oneOverN",
  "vpw",
  "guytonKlinger",
];

export function validateHistoricalBacktestInput(values: HistoricalBacktestInputValues): void {
  const errors: DecisionError[] = [];

  if (!Number.isFinite(values.initialPortfolio) || values.initialPortfolio <= 0) {
    errors.push({
      code: "invalid_initial_portfolio",
      field: "initialPortfolio",
      severity: "error",
      message: "La cartera inicial debe ser un número mayor que cero.",
    });
  }

  if (!Number.isFinite(values.monthlyExpenses) || values.monthlyExpenses <= 0) {
    errors.push({
      code: "invalid_monthly_expenses",
      field: "monthlyExpenses",
      severity: "error",
      message: "El gasto mensual debe ser un número mayor que cero.",
    });
  }

  if (
    !Number.isFinite(values.stockAllocationPct) ||
    values.stockAllocationPct < 0 ||
    values.stockAllocationPct > 100
  ) {
    errors.push({
      code: "invalid_stock_allocation",
      field: "stockAllocationPct",
      severity: "error",
      message: "El porcentaje en acciones debe estar entre 0 % y 100 %.",
    });
  }

  if (!Number.isInteger(values.years) || values.years < MIN_YEARS || values.years > MAX_YEARS) {
    errors.push({
      code: "invalid_years",
      field: "years",
      severity: "error",
      message: `La duración debe estar entre ${MIN_YEARS} y ${MAX_YEARS} años.`,
    });
  }

  if (!VALID_STRATEGY_IDS.includes(values.withdrawalStrategyId)) {
    errors.push({
      code: "invalid_withdrawal_strategy",
      field: "withdrawalStrategyId",
      severity: "error",
      message: "Elige una estrategia de retirada válida.",
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}
