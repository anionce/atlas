import { DecisionValidationError } from "../../errors";
import type { DecisionError } from "../../shared-types";
import type { SavingsRateInputValues } from "./types";

const MAX_RETURN_RATE_PCT = 20;

export function validateSavingsRateInput(values: SavingsRateInputValues): void {
  const errors: DecisionError[] = [];

  if (!Number.isFinite(values.monthlyIncome) || values.monthlyIncome <= 0) {
    errors.push({
      code: "invalid_monthly_income",
      field: "monthlyIncome",
      severity: "error",
      message: "El ingreso mensual debe ser un número mayor que cero.",
    });
  }

  if (!Number.isFinite(values.monthlyExpenses) || values.monthlyExpenses < 0) {
    errors.push({
      code: "negative_monthly_expenses",
      field: "monthlyExpenses",
      severity: "error",
      message: "El gasto mensual no puede ser negativo.",
    });
  }

  if (
    values.currentInvestments !== undefined &&
    (!Number.isFinite(values.currentInvestments) || values.currentInvestments < 0)
  ) {
    errors.push({
      code: "negative_current_investments",
      field: "currentInvestments",
      severity: "error",
      message: "Lo que ya tienes invertido no puede ser negativo.",
    });
  }

  if (
    !Number.isFinite(values.annualReturnRate) ||
    values.annualReturnRate < 0 ||
    values.annualReturnRate > MAX_RETURN_RATE_PCT
  ) {
    errors.push({
      code: "invalid_annual_return_rate",
      field: "annualReturnRate",
      severity: "error",
      message: `La rentabilidad anual debe estar entre 0 % y ${MAX_RETURN_RATE_PCT} %.`,
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}
