import { DecisionValidationError } from "../../errors";
import type { DecisionError } from "../../shared-types";
import type { CompoundInterestInputValues } from "./types";

const MAX_YEARS = 60;
const MAX_RETURN_RATE_PCT = 20;

export function validateCompoundInterestInput(values: CompoundInterestInputValues): void {
  const errors: DecisionError[] = [];

  if (
    values.initialAmount !== undefined &&
    (!Number.isFinite(values.initialAmount) || values.initialAmount < 0)
  ) {
    errors.push({
      code: "negative_initial_amount",
      field: "initialAmount",
      severity: "error",
      message: "El capital inicial no puede ser negativo.",
    });
  }

  if (!Number.isFinite(values.monthlyContribution) || values.monthlyContribution < 0) {
    errors.push({
      code: "negative_monthly_contribution",
      field: "monthlyContribution",
      severity: "error",
      message: "La aportación mensual no puede ser negativa.",
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

  if (!Number.isInteger(values.years) || values.years < 1 || values.years > MAX_YEARS) {
    errors.push({
      code: "invalid_years",
      field: "years",
      severity: "error",
      message: `El plazo debe estar entre 1 y ${MAX_YEARS} años.`,
    });
  }

  if (
    values.goalAmount !== undefined &&
    (!Number.isFinite(values.goalAmount) || values.goalAmount <= 0)
  ) {
    errors.push({
      code: "invalid_goal_amount",
      field: "goalAmount",
      severity: "error",
      message: "El objetivo de ahorro debe ser un número mayor que cero.",
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}
