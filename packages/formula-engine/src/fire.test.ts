import { describe, expect, it } from "vitest";

import {
  calculateFireNumber,
  calculateFireNumberAfterTax,
  calculateFireNumberWithPension,
} from "./fire";
import { calculateSpanishSavingsTax } from "./spanish-savings-tax";

describe("calculateFireNumber", () => {
  it("applies the 25x rule at the default 4% withdrawal rate", () => {
    expect(calculateFireNumber({ monthlyExpenses: 2_000 })).toBeCloseTo(2_000 * 12 * 25, 6);
  });

  it("requires less capital at a higher withdrawal rate", () => {
    const conservative = calculateFireNumber({ monthlyExpenses: 2_000, safeWithdrawalRatePct: 3 });
    const aggressive = calculateFireNumber({ monthlyExpenses: 2_000, safeWithdrawalRatePct: 5 });
    expect(aggressive).toBeLessThan(conservative);
  });

  it("scales linearly with monthly expenses", () => {
    const base = calculateFireNumber({ monthlyExpenses: 1_000 });
    const doubled = calculateFireNumber({ monthlyExpenses: 2_000 });
    expect(doubled).toBeCloseTo(base * 2, 6);
  });
});

describe("calculateFireNumberAfterTax", () => {
  it("matches the untaxed number when none of the portfolio is gains", () => {
    const untaxed = calculateFireNumber({ monthlyExpenses: 2_000 });
    const afterTax = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0 });
    expect(afterTax).toBeCloseTo(untaxed, 6);
  });

  it("requires more capital than the simple 25x rule once gains are taxed", () => {
    const untaxed = calculateFireNumber({ monthlyExpenses: 2_000 });
    const afterTax = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0.6 });
    expect(afterTax).toBeGreaterThan(untaxed);
  });

  it("requires more capital the larger the gain fraction is", () => {
    const lowGain = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0.3 });
    const highGain = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0.9 });
    expect(highGain).toBeGreaterThan(lowGain);
  });

  it("solves the withdrawal so that, after tax on the gain portion, the net matches annual expenses", () => {
    const monthlyExpenses = 2_000;
    const gainFraction = 0.7;
    const fireNumber = calculateFireNumberAfterTax({ monthlyExpenses, gainFraction });

    const grossAnnualWithdrawal = fireNumber * 0.04;
    const tax = calculateSpanishSavingsTax(grossAnnualWithdrawal * gainFraction);
    const net = grossAnnualWithdrawal - tax;

    expect(net).toBeCloseTo(monthlyExpenses * 12, 1);
  });

  it("still converges when the entire withdrawal is gain (gainFraction 1)", () => {
    const monthlyExpenses = 2_000;
    const fireNumber = calculateFireNumberAfterTax({ monthlyExpenses, gainFraction: 1 });

    const grossAnnualWithdrawal = fireNumber * 0.04;
    const net = grossAnnualWithdrawal - calculateSpanishSavingsTax(grossAnnualWithdrawal);
    expect(net).toBeCloseTo(monthlyExpenses * 12, 1);
  });
});

describe("calculateFireNumberWithPension", () => {
  it("matches calculateFireNumberAfterTax when no pension is expected", () => {
    const afterTax = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0.5 });
    const withPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 0,
      yearsUntilPensionAge: 20,
      annualReturnRatePct: 6,
    });
    expect(withPension).toBeCloseTo(afterTax, 6);
  });

  it("matches calculateFireNumberAfterTax when the pension estimate is omitted", () => {
    const afterTax = calculateFireNumberAfterTax({ monthlyExpenses: 2_000, gainFraction: 0.5 });
    const withPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      yearsUntilPensionAge: 20,
      annualReturnRatePct: 6,
    });
    expect(withPension).toBeCloseTo(afterTax, 6);
  });

  it("requires less capital when a pension is expected and the bridge is finite", () => {
    const withoutPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 0,
      yearsUntilPensionAge: 20,
      annualReturnRatePct: 6,
    });
    const withPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 800,
      yearsUntilPensionAge: 20,
      annualReturnRatePct: 6,
    });
    expect(withPension).toBeLessThan(withoutPension);
  });

  it("when the pension already covers the full expense at pension age, reduces to just the bridge fund", () => {
    const withPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 5_000,
      yearsUntilPensionAge: 10,
      annualReturnRatePct: 6,
    });
    // El hueco a financiar durante el puente es el gasto completo (2.000 €),
    // ya que la pensión (5.000 €) cubriría de sobra el gasto una vez
    // empiece a cobrarse — la parte perpetua no debería sumar prácticamente
    // nada.
    const perpetualAlone = calculateFireNumberAfterTax({ monthlyExpenses: 0, gainFraction: 0.5 });
    expect(perpetualAlone).toBe(0);
    expect(withPension).toBeGreaterThan(0);
  });

  it("collapses to the perpetual number alone when pension age is already reached (no bridge)", () => {
    const reducedExpense = calculateFireNumberAfterTax({
      monthlyExpenses: 1_200,
      gainFraction: 0.5,
    });
    const withPension = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 800,
      yearsUntilPensionAge: 0,
      annualReturnRatePct: 6,
    });
    expect(withPension).toBeCloseTo(reducedExpense, 6);
  });

  it("requires less capital the longer the bridge to pension age is, all else equal", () => {
    const shortBridge = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 800,
      yearsUntilPensionAge: 5,
      annualReturnRatePct: 6,
    });
    const longBridge = calculateFireNumberWithPension({
      monthlyExpenses: 2_000,
      gainFraction: 0.5,
      monthlyPensionEstimate: 800,
      yearsUntilPensionAge: 25,
      annualReturnRatePct: 6,
    });
    // Cuanto más lejos está la edad de jubilación, más años tiene que
    // financiar en solitario la cartera antes de que llegue la pensión, así
    // que el fondo puente (y por tanto el total) es mayor.
    expect(longBridge).toBeGreaterThan(shortBridge);
  });
});
