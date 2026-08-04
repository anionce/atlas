import { calculateMortgage, maxPrincipalForPayment } from "./mortgage";

export interface AffordabilityInput {
  monthlyIncome: number;
  /** Cuotas de otras deudas que ya paga el usuario cada mes. */
  monthlyDebts?: number;
  savings: number;
  annualInterestRatePct: number;
  years: number;
  /** Entrada como fracción del precio (0.2 = 20 %). Por defecto 20 %. */
  downPaymentRatio?: number;
  /** Máximo % de los ingresos que debería suponer la cuota. Por defecto 35 %. */
  maxDebtRatioPct?: number;
}

export interface AffordabilityResult {
  maxPropertyPrice: number;
  maxMortgagePrincipal: number;
  requiredEntry: number;
  estimatedMonthlyPayment: number;
  debtRatioPct: number;
  /** Cuál de los dos límites (ingresos o ahorro) es el que restringe el resultado. */
  limitingFactor: "income" | "savings";
}

const DEFAULT_DOWN_PAYMENT_RATIO = 0.2;
const DEFAULT_MAX_DEBT_RATIO_PCT = 35;
/** Estimación simplificada de gastos de compra como % del precio, usada solo para el sondeo de capacidad. */
const ESTIMATED_COSTS_RATIO = 0.1;

/**
 * Cuánto puede permitirse gastar alguien en una vivienda, combinando dos límites:
 * lo que el banco financiaría según sus ingresos, y lo que sus ahorros le permiten
 * cubrir de entrada + gastos. Devuelve siempre el más restrictivo de los dos.
 */
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const {
    monthlyIncome,
    monthlyDebts = 0,
    savings,
    annualInterestRatePct,
    years,
    downPaymentRatio = DEFAULT_DOWN_PAYMENT_RATIO,
    maxDebtRatioPct = DEFAULT_MAX_DEBT_RATIO_PCT,
  } = input;

  const maxMonthlyPayment = Math.max(0, monthlyIncome * (maxDebtRatioPct / 100) - monthlyDebts);
  const maxMortgagePrincipal = maxPrincipalForPayment(
    maxMonthlyPayment,
    annualInterestRatePct,
    years,
  );
  const maxPropertyPriceFromIncome = maxMortgagePrincipal / (1 - downPaymentRatio);

  const maxPropertyPriceFromSavings = savings / (downPaymentRatio + ESTIMATED_COSTS_RATIO);

  const limitingFactor: AffordabilityResult["limitingFactor"] =
    maxPropertyPriceFromSavings < maxPropertyPriceFromIncome ? "savings" : "income";
  const maxPropertyPrice = Math.max(
    0,
    Math.min(maxPropertyPriceFromIncome, maxPropertyPriceFromSavings),
  );

  const financedPrincipal = maxPropertyPrice * (1 - downPaymentRatio);
  const { monthlyPayment: estimatedMonthlyPayment } = calculateMortgage({
    principal: financedPrincipal,
    annualInterestRatePct,
    years,
  });

  const debtRatioPct = monthlyIncome > 0 ? (estimatedMonthlyPayment / monthlyIncome) * 100 : 0;

  return {
    maxPropertyPrice,
    maxMortgagePrincipal: financedPrincipal,
    requiredEntry: maxPropertyPrice * downPaymentRatio,
    estimatedMonthlyPayment,
    debtRatioPct,
    limitingFactor,
  };
}
