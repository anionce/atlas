import { describe, expect, it } from "vitest";

import { calculateCompoundInterest, monthsToReachGoal } from "./compound-interest";

describe("calculateCompoundInterest", () => {
  it("with 0% return, the balance is just principal plus contributions", () => {
    const result = calculateCompoundInterest({
      initialAmount: 1_000,
      monthlyContribution: 100,
      annualReturnRatePct: 0,
      years: 2,
    });
    expect(result.finalBalance).toBeCloseTo(1_000 + 100 * 24, 6);
    expect(result.totalInterestEarned).toBeCloseTo(0, 6);
  });

  it("splits the final balance into contributed and earned", () => {
    const result = calculateCompoundInterest({
      initialAmount: 5_000,
      monthlyContribution: 200,
      annualReturnRatePct: 6,
      years: 10,
    });
    expect(result.finalBalance).toBeCloseTo(
      result.totalContributed + result.totalInterestEarned,
      6,
    );
    expect(result.totalContributed).toBeCloseTo(5_000 + 200 * 120, 6);
    expect(result.totalInterestEarned).toBeGreaterThan(0);
  });

  it("earns more interest over a longer horizon at the same rate", () => {
    const short = calculateCompoundInterest({
      initialAmount: 0,
      monthlyContribution: 100,
      annualReturnRatePct: 5,
      years: 5,
    });
    const long = calculateCompoundInterest({
      initialAmount: 0,
      monthlyContribution: 100,
      annualReturnRatePct: 5,
      years: 20,
    });
    expect(long.totalInterestEarned).toBeGreaterThan(short.totalInterestEarned);
  });
});

describe("monthsToReachGoal", () => {
  it("returns 0 when the initial amount already meets the goal", () => {
    expect(monthsToReachGoal(1_000, 1_500, 100, 5)).toBe(0);
  });

  it("returns null when nothing is saved and the goal is unreachable", () => {
    expect(monthsToReachGoal(10_000, 0, 0, 0)).toBeNull();
  });

  it("matches calculateCompoundInterest at the computed month (0% return)", () => {
    const months = monthsToReachGoal(2_500, 0, 100, 0);
    expect(months).not.toBeNull();
    const result = calculateCompoundInterest({
      initialAmount: 0,
      monthlyContribution: 100,
      annualReturnRatePct: 0,
      years: (months as number) / 12,
    });
    expect(result.finalBalance).toBeGreaterThanOrEqual(2_500 - 1e-6);
  });

  it("reaching the goal takes fewer months with a higher return rate", () => {
    const slow = monthsToReachGoal(20_000, 1_000, 200, 2);
    const fast = monthsToReachGoal(20_000, 1_000, 200, 8);
    expect(fast).not.toBeNull();
    expect(slow).not.toBeNull();
    expect(fast as number).toBeLessThan(slow as number);
  });
});
