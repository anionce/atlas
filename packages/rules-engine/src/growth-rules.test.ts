import { describe, expect, it } from "vitest";

import { evaluateGrowthRules } from "./growth-rules";

describe("evaluateGrowthRules", () => {
  it("flags it when interest earned exceeds what was actually contributed", () => {
    expect(evaluateGrowthRules({ totalContributed: 10_000, totalInterestEarned: 15_000 })).toEqual([
      { code: "interest_exceeds_contributions", severity: "success" },
    ]);
  });

  it("has nothing to say when contributions still lead", () => {
    expect(evaluateGrowthRules({ totalContributed: 10_000, totalInterestEarned: 2_000 })).toEqual(
      [],
    );
  });

  it("has nothing to say when nothing was contributed", () => {
    expect(evaluateGrowthRules({ totalContributed: 0, totalInterestEarned: 0 })).toEqual([]);
  });
});
