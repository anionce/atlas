import { calculateAffordability, calculatePurchaseCosts } from "@atlas/formula-engine";
import type { AffordabilityResult } from "@atlas/formula-engine";

import type { BuyHomeInputValues, DecisionMetrics } from "./types";

const DEFAULT_DOWN_PAYMENT_RATIO = 0.2;

export function computeAffordability(values: BuyHomeInputValues): AffordabilityResult {
  return calculateAffordability({
    monthlyIncome: values.monthlyIncome,
    monthlyDebts: values.monthlyDebts,
    savings: values.savings,
    annualInterestRatePct: values.interestRate,
    years: values.mortgageYears,
    downPaymentRatio: values.downPaymentRatio ?? DEFAULT_DOWN_PAYMENT_RATIO,
  });
}

export function computeMetrics(values: BuyHomeInputValues): DecisionMetrics {
  const affordability = computeAffordability(values);
  const purchaseCosts = calculatePurchaseCosts({
    propertyPrice: affordability.maxPropertyPrice,
    isNewConstruction: values.isNewConstruction,
  });

  return {
    maxPropertyPrice: affordability.maxPropertyPrice,
    requiredEntry: affordability.requiredEntry,
    monthlyPayment: affordability.estimatedMonthlyPayment,
    totalInterest: affordability.maxMortgagePrincipal
      ? affordability.estimatedMonthlyPayment * values.mortgageYears * 12 -
        affordability.maxMortgagePrincipal
      : 0,
    debtRatioPct: affordability.debtRatioPct,
    purchaseCosts: purchaseCosts.total,
  };
}
