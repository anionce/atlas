import { DecisionValidationError } from "../../errors";
import type { DecisionError } from "../../shared-types";
import type { FireInputValues } from "./types";

const MIN_AGE = 18;
const MAX_AGE = 100;
const MAX_RETURN_RATE_PCT = 20;

export function validateFireInput(values: FireInputValues): void {
  const errors: DecisionError[] = [];

  if (
    !Number.isInteger(values.currentAge) ||
    values.currentAge < MIN_AGE ||
    values.currentAge > MAX_AGE
  ) {
    errors.push({
      code: "invalid_current_age",
      field: "currentAge",
      severity: "error",
      message: `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años.`,
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

  if (!Number.isFinite(values.monthlyExpenses) || values.monthlyExpenses <= 0) {
    errors.push({
      code: "invalid_monthly_expenses",
      field: "monthlyExpenses",
      severity: "error",
      message: "El gasto mensual debe ser un número mayor que cero.",
    });
  }

  if (
    values.monthlyPensionEstimate !== undefined &&
    (!Number.isFinite(values.monthlyPensionEstimate) || values.monthlyPensionEstimate < 0)
  ) {
    errors.push({
      code: "negative_monthly_pension_estimate",
      field: "monthlyPensionEstimate",
      severity: "error",
      message: "La estimación de pensión pública no puede ser negativa.",
    });
  }

  if (
    values.currentGrossMonthlyIncome !== undefined &&
    (!Number.isFinite(values.currentGrossMonthlyIncome) || values.currentGrossMonthlyIncome < 0)
  ) {
    errors.push({
      code: "negative_current_gross_monthly_income",
      field: "currentGrossMonthlyIncome",
      severity: "error",
      message: "El salario bruto mensual no puede ser negativo.",
    });
  }

  if (
    values.yearsAlreadyContributed !== undefined &&
    (!Number.isFinite(values.yearsAlreadyContributed) ||
      values.yearsAlreadyContributed < 0 ||
      values.yearsAlreadyContributed > 60)
  ) {
    errors.push({
      code: "invalid_years_already_contributed",
      field: "yearsAlreadyContributed",
      severity: "error",
      message: "Los años cotizados deben estar entre 0 y 60.",
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}
