import { describe, expect, it } from "vitest";

import {
  estimateSpanishPublicPensionGrossMonthly,
  estimateSpanishPublicPensionNetMonthly,
} from "./spanish-pension-estimate";

describe("estimateSpanishPublicPensionGrossMonthly", () => {
  it("returns 0 when fewer than 15 years are contributed in total", () => {
    const estimate = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_500,
      yearsAlreadyContributed: 5,
      additionalYearsContributing: 8,
    });
    expect(estimate).toBe(0);
  });

  it("applies exactly 50% of the base at 15 years contributed", () => {
    const estimate = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 10,
      additionalYearsContributing: 5,
    });
    expect(estimate).toBeCloseTo(2_000 * 0.5, 6);
  });

  it("reaches 100% of the base at 36 years and 6 months contributed", () => {
    const estimate = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 20,
      additionalYearsContributing: 16.5,
    });
    expect(estimate).toBeCloseTo(2_000, 1);
  });

  it("never exceeds 100% of the base beyond 36 years and 6 months", () => {
    const at36y6m = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 36.5,
      additionalYearsContributing: 0,
    });
    const at45y = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 45,
      additionalYearsContributing: 0,
    });
    expect(at45y).toBeCloseTo(at36y6m, 6);
  });

  it("caps the contribution base used, even for very high salaries", () => {
    const veryHighSalary = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 20_000,
      yearsAlreadyContributed: 40,
      additionalYearsContributing: 0,
    });
    const atCap = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 5_101.2,
      yearsAlreadyContributed: 40,
      additionalYearsContributing: 0,
    });
    expect(veryHighSalary).toBeCloseTo(atCap, 6);
  });

  it("requires more pension the more years are contributed, between 15 and 36.5 years", () => {
    const fewerYears = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 16,
      additionalYearsContributing: 0,
    });
    const moreYears = estimateSpanishPublicPensionGrossMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 25,
      additionalYearsContributing: 0,
    });
    expect(moreYears).toBeGreaterThan(fewerYears);
  });
});

describe("estimateSpanishPublicPensionNetMonthly", () => {
  it("returns less than the gross estimate once tax is applied", () => {
    const input = {
      currentGrossMonthlyIncome: 3_000,
      yearsAlreadyContributed: 25,
      additionalYearsContributing: 5,
    };
    const gross = estimateSpanishPublicPensionGrossMonthly(input);
    const net = estimateSpanishPublicPensionNetMonthly(input);
    expect(net).toBeLessThan(gross);
    expect(net).toBeGreaterThan(0);
  });

  it("returns 0 when there is no entitlement to a pension", () => {
    const net = estimateSpanishPublicPensionNetMonthly({
      currentGrossMonthlyIncome: 2_000,
      yearsAlreadyContributed: 2,
      additionalYearsContributing: 3,
    });
    expect(net).toBe(0);
  });
});
