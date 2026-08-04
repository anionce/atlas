import { describe, expect, it } from "vitest";

import { calculateAffordability } from "./affordability";
import { calculateMortgage } from "./mortgage";

describe("calculateAffordability", () => {
  it("is limited by savings when the down payment + costs exceed what's saved", () => {
    const result = calculateAffordability({
      monthlyIncome: 3_000,
      savings: 20_000,
      annualInterestRatePct: 3,
      years: 30,
    });
    expect(result.limitingFactor).toBe("savings");
  });

  it("is limited by income when savings are abundant", () => {
    const result = calculateAffordability({
      monthlyIncome: 1_500,
      savings: 500_000,
      annualInterestRatePct: 3,
      years: 30,
    });
    expect(result.limitingFactor).toBe("income");
  });

  it("keeps the resulting debt ratio at or below the requested maximum", () => {
    const result = calculateAffordability({
      monthlyIncome: 2_500,
      savings: 400_000,
      annualInterestRatePct: 3.2,
      years: 30,
      maxDebtRatioPct: 35,
    });
    expect(result.debtRatioPct).toBeLessThanOrEqual(35 + 0.01);
  });

  it("required entry matches maxPropertyPrice * downPaymentRatio", () => {
    const result = calculateAffordability({
      monthlyIncome: 2_800,
      savings: 60_000,
      annualInterestRatePct: 3,
      years: 30,
      downPaymentRatio: 0.2,
    });
    expect(result.requiredEntry).toBeCloseTo(result.maxPropertyPrice * 0.2, 6);
  });

  it("the estimated payment matches recomputing the mortgage on the financed principal", () => {
    const result = calculateAffordability({
      monthlyIncome: 2_800,
      savings: 60_000,
      annualInterestRatePct: 3,
      years: 30,
    });
    const { monthlyPayment } = calculateMortgage({
      principal: result.maxMortgagePrincipal,
      annualInterestRatePct: 3,
      years: 30,
    });
    expect(result.estimatedMonthlyPayment).toBeCloseTo(monthlyPayment, 6);
  });

  it("existing monthly debts reduce how much can be afforded", () => {
    const withoutDebts = calculateAffordability({
      monthlyIncome: 3_000,
      savings: 500_000,
      annualInterestRatePct: 3,
      years: 30,
    });
    const withDebts = calculateAffordability({
      monthlyIncome: 3_000,
      monthlyDebts: 500,
      savings: 500_000,
      annualInterestRatePct: 3,
      years: 30,
    });
    expect(withDebts.maxPropertyPrice).toBeLessThan(withoutDebts.maxPropertyPrice);
  });
});
