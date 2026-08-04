import { describe, expect, it } from "vitest";

import { calculateMortgage, maxPrincipalForPayment } from "./mortgage";

describe("calculateMortgage", () => {
  it("splits the total cost into principal and interest", () => {
    const result = calculateMortgage({ principal: 200_000, annualInterestRatePct: 3, years: 30 });
    expect(result.totalCost).toBeCloseTo(result.principal + result.totalInterest, 6);
    expect(result.monthlyPayment * 360).toBeCloseTo(result.totalCost, 6);
  });

  it("charges no interest when the rate is 0%", () => {
    const result = calculateMortgage({ principal: 120_000, annualInterestRatePct: 0, years: 10 });
    expect(result.monthlyPayment).toBeCloseTo(1_000, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
  });

  it("produces a realistic monthly payment for a typical 30-year mortgage", () => {
    const result = calculateMortgage({ principal: 200_000, annualInterestRatePct: 3, years: 30 });
    // ~843€/mes es el orden de magnitud esperado para este escenario.
    expect(result.monthlyPayment).toBeGreaterThan(800);
    expect(result.monthlyPayment).toBeLessThan(900);
  });

  it("charges more interest for longer terms at the same rate", () => {
    const short = calculateMortgage({ principal: 200_000, annualInterestRatePct: 3, years: 15 });
    const long = calculateMortgage({ principal: 200_000, annualInterestRatePct: 3, years: 30 });
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
    expect(long.monthlyPayment).toBeLessThan(short.monthlyPayment);
  });
});

describe("maxPrincipalForPayment", () => {
  it("round-trips with calculateMortgage", () => {
    const input = { principal: 250_000, annualInterestRatePct: 3.5, years: 25 };
    const { monthlyPayment } = calculateMortgage(input);
    const principal = maxPrincipalForPayment(
      monthlyPayment,
      input.annualInterestRatePct,
      input.years,
    );
    expect(principal).toBeCloseTo(input.principal, 2);
  });

  it("round-trips at 0% interest", () => {
    const principal = maxPrincipalForPayment(1_000, 0, 10);
    expect(principal).toBeCloseTo(120_000, 6);
  });
});
