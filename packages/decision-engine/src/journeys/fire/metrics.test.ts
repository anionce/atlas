import { describe, expect, it } from "vitest";

import { computeMetrics } from "./metrics";
import type { FireInputValues } from "./types";

const values: FireInputValues = {
  currentAge: 30,
  currentInvestments: 10_000,
  monthlyContribution: 800,
  annualReturnRate: 6,
  monthlyExpenses: 1_500,
};

describe("computeMetrics", () => {
  it("computes the FIRE number from monthly expenses (25x rule)", () => {
    const metrics = computeMetrics(values);
    expect(metrics.fireNumber).toBeCloseTo(1_500 * 12 * 25, 6);
  });

  it("computes a reachable ageAtFire consistent with monthsToFire", () => {
    const metrics = computeMetrics(values);
    expect(metrics.monthsToFire).not.toBeNull();
    expect(metrics.ageAtFire).toBeCloseTo(30 + (metrics.monthsToFire as number) / 12, 6);
  });

  it("leaves monthsToFire and ageAtFire as null when unreachable", () => {
    const metrics = computeMetrics({
      ...values,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
    });
    expect(metrics.monthsToFire).toBeNull();
    expect(metrics.ageAtFire).toBeNull();
  });

  it("defaults currentInvestments to 0 when omitted", () => {
    const withoutInitial = computeMetrics({
      currentAge: 30,
      monthlyContribution: 800,
      annualReturnRate: 6,
      monthlyExpenses: 1_500,
    });
    const withZero = computeMetrics({ ...values, currentInvestments: 0 });
    expect(withoutInitial.monthsToFire).toBe(withZero.monthsToFire);
  });

  it("requires more capital after tax than the untaxed fireNumber, when FIRE is reachable", () => {
    const metrics = computeMetrics(values);
    expect(metrics.monthsToFire).not.toBeNull();
    expect(metrics.fireNumberAfterTax).toBeGreaterThan(metrics.fireNumber);
  });

  it("falls back to the untaxed number when FIRE is unreachable (no gain fraction to compute)", () => {
    const metrics = computeMetrics({
      ...values,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
    });
    expect(metrics.monthsToFire).toBeNull();
    expect(metrics.fireNumberAfterTax).toBeCloseTo(metrics.fireNumber, 6);
  });

  it("needs no tax adjustment when already at the goal (100% contributed, 0% gain)", () => {
    const metrics = computeMetrics({ ...values, currentInvestments: 1_500 * 12 * 25 });
    expect(metrics.monthsToFire).toBe(0);
    expect(metrics.fireNumberAfterTax).toBeCloseTo(metrics.fireNumber, 6);
  });

  it("matches fireNumberAfterTax when no pension estimate is given", () => {
    const metrics = computeMetrics(values);
    expect(metrics.fireNumberWithPension).toBeCloseTo(metrics.fireNumberAfterTax, 6);
  });

  it("requires less capital when a public pension estimate is given and FIRE is reached well before pension age", () => {
    const withoutPension = computeMetrics(values);
    const withPension = computeMetrics({ ...values, monthlyPensionEstimate: 900 });
    expect(withPension.fireNumberWithPension).toBeLessThan(withoutPension.fireNumberWithPension);
  });

  it("matches fireNumberAfterTax when FIRE is unreachable and no pension estimate is given", () => {
    const metrics = computeMetrics({
      ...values,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
    });
    expect(metrics.monthsToFire).toBeNull();
    expect(metrics.fireNumberWithPension).toBeCloseTo(metrics.fireNumberAfterTax, 6);
  });

  it("treats an unreachable ageAtFire as if pension were already available (no bridge to size)", () => {
    // Sin ageAtFire no hay forma de saber cuántos años quedan hasta la
    // pensión, así que se asume que ya estaría disponible — es la
    // aproximación más simple, no un cálculo real del puente.
    const metrics = computeMetrics({
      ...values,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualReturnRate: 0,
      monthlyPensionEstimate: 900,
    });
    expect(metrics.monthsToFire).toBeNull();
    expect(metrics.fireNumberWithPension).toBeLessThan(metrics.fireNumberAfterTax);
  });

  it("reports the pension source as 'reported' when monthlyPensionEstimate is given directly", () => {
    const metrics = computeMetrics({ ...values, monthlyPensionEstimate: 900 });
    expect(metrics.pensionSource).toBe("reported");
    expect(metrics.effectiveMonthlyPension).toBe(900);
  });

  it("reports the pension source as 'none' when no pension data is given at all", () => {
    const metrics = computeMetrics(values);
    expect(metrics.pensionSource).toBe("none");
    expect(metrics.effectiveMonthlyPension).toBe(0);
  });

  it("falls back to an automatic estimate when salary and years contributed are given instead", () => {
    const metrics = computeMetrics({
      ...values,
      currentGrossMonthlyIncome: 2_500,
      yearsAlreadyContributed: 10,
    });
    expect(metrics.pensionSource).toBe("estimated");
    expect(metrics.effectiveMonthlyPension).toBeGreaterThan(0);
    expect(metrics.fireNumberWithPension).toBeLessThan(metrics.fireNumberAfterTax);
  });

  it("prefers the directly reported pension over the automatic estimate when both are given", () => {
    const metrics = computeMetrics({
      ...values,
      monthlyPensionEstimate: 1_200,
      currentGrossMonthlyIncome: 2_500,
      yearsAlreadyContributed: 10,
    });
    expect(metrics.pensionSource).toBe("reported");
    expect(metrics.effectiveMonthlyPension).toBe(1_200);
  });
});
