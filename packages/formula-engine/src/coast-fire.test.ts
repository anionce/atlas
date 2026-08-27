import { describe, expect, it } from "vitest";

import { calculateCoastFire } from "./coast-fire";

describe("calculateCoastFire", () => {
  it("reports already coasting when current investments already cover the discounted target", () => {
    const result = calculateCoastFire({
      fireNumber: 500_000,
      currentInvestments: 500_000,
      monthlyContribution: 0,
      annualReturnRatePct: 6,
      currentAge: 40,
      targetAge: 67,
    });
    expect(result.alreadyCoasting).toBe(true);
    expect(result.coastFireAge).toBe(40);
  });

  it("requires less capital today the more years remain until the target age", () => {
    const soon = calculateCoastFire({
      fireNumber: 500_000,
      currentInvestments: 0,
      monthlyContribution: 500,
      annualReturnRatePct: 6,
      currentAge: 60,
      targetAge: 67,
    });
    const faraway = calculateCoastFire({
      fireNumber: 500_000,
      currentInvestments: 0,
      monthlyContribution: 500,
      annualReturnRatePct: 6,
      currentAge: 25,
      targetAge: 67,
    });
    expect(faraway.coastFireNumberToday).toBeLessThan(soon.coastFireNumberToday);
  });

  it("finds a coast FIRE age when contributing steadily eventually crosses the discounted target", () => {
    const result = calculateCoastFire({
      fireNumber: 500_000,
      currentInvestments: 10_000,
      monthlyContribution: 1_000,
      annualReturnRatePct: 7,
      currentAge: 25,
      targetAge: 67,
    });
    expect(result.alreadyCoasting).toBe(false);
    expect(result.coastFireAge).not.toBeNull();
    expect(result.coastFireAge as number).toBeGreaterThan(25);
    expect(result.coastFireAge as number).toBeLessThan(67);
  });

  it("returns null coastFireAge when contributions are too low to ever coast before the target age", () => {
    const result = calculateCoastFire({
      fireNumber: 2_000_000,
      currentInvestments: 0,
      monthlyContribution: 10,
      annualReturnRatePct: 4,
      currentAge: 60,
      targetAge: 62,
    });
    expect(result.alreadyCoasting).toBe(false);
    expect(result.coastFireAge).toBeNull();
  });

  it("the coast FIRE number equals the full FIRE number once age reaches the target age", () => {
    const result = calculateCoastFire({
      fireNumber: 500_000,
      currentInvestments: 500_000,
      monthlyContribution: 0,
      annualReturnRatePct: 6,
      currentAge: 67,
      targetAge: 67,
    });
    expect(result.coastFireNumberToday).toBeCloseTo(500_000, 6);
    expect(result.alreadyCoasting).toBe(true);
  });
});
