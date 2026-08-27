import { describe, expect, it } from "vitest";

import { calculateFireNumber, calculateFireNumberAfterTax } from "./fire";
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
