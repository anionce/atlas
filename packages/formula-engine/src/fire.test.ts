import { describe, expect, it } from "vitest";

import { calculateFireNumber } from "./fire";

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
