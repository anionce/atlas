import { DecisionValidationError } from "./errors";
import type { BuyHomeInputValues, DecisionError } from "./types";

const MAX_MORTGAGE_YEARS = 40;
const MAX_INTEREST_RATE_PCT = 15;

/**
 * Validación en dos fases: primero formato/tipos, después coherencia de negocio.
 * Lanza DecisionValidationError con todos los problemas encontrados a la vez,
 * en vez de fallar en el primero.
 */
export function validateBuyHomeInput(values: BuyHomeInputValues): void {
  const errors: DecisionError[] = [];

  if (!Number.isFinite(values.monthlyIncome) || values.monthlyIncome <= 0) {
    errors.push({
      code: "invalid_monthly_income",
      field: "monthlyIncome",
      severity: "error",
      message: "Los ingresos mensuales deben ser un número mayor que cero.",
    });
  }

  if (!Number.isFinite(values.savings) || values.savings < 0) {
    errors.push({
      code: "negative_savings",
      field: "savings",
      severity: "error",
      message: "El ahorro no puede ser negativo.",
    });
  }

  if (values.monthlyDebts !== undefined && values.monthlyDebts < 0) {
    errors.push({
      code: "negative_monthly_debts",
      field: "monthlyDebts",
      severity: "error",
      message: "Las deudas mensuales no pueden ser negativas.",
    });
  }

  if (values.monthlySavingsCapacity !== undefined && values.monthlySavingsCapacity < 0) {
    errors.push({
      code: "negative_savings_capacity",
      field: "monthlySavingsCapacity",
      severity: "error",
      message: "La capacidad de ahorro mensual no puede ser negativa.",
    });
  }

  if (
    !Number.isFinite(values.interestRate) ||
    values.interestRate < 0 ||
    values.interestRate > MAX_INTEREST_RATE_PCT
  ) {
    errors.push({
      code: "invalid_interest_rate",
      field: "interestRate",
      severity: "error",
      message: `El tipo de interés debe estar entre 0 % y ${MAX_INTEREST_RATE_PCT} %.`,
    });
  }

  if (
    !Number.isInteger(values.mortgageYears) ||
    values.mortgageYears < 1 ||
    values.mortgageYears > MAX_MORTGAGE_YEARS
  ) {
    errors.push({
      code: "invalid_mortgage_years",
      field: "mortgageYears",
      severity: "error",
      message: `El plazo de la hipoteca debe estar entre 1 y ${MAX_MORTGAGE_YEARS} años.`,
    });
  }

  if (
    values.downPaymentRatio !== undefined &&
    (values.downPaymentRatio < 0 || values.downPaymentRatio > 0.9)
  ) {
    errors.push({
      code: "invalid_down_payment_ratio",
      field: "downPaymentRatio",
      severity: "error",
      message: "La entrada debe estar entre el 0 % y el 90 % del precio.",
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}
