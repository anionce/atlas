import { describe, expect, it } from "vitest";

import { evaluateFireRules } from "./fire-rules";

describe("evaluateFireRules", () => {
  it("warns when FIRE is unreachable at the current pace", () => {
    expect(evaluateFireRules({ monthsToFire: null })).toEqual([
      { code: "fire_unreachable", severity: "warning" },
    ]);
  });

  it("celebrates reaching FIRE within a decade", () => {
    expect(evaluateFireRules({ monthsToFire: 100 })).toEqual([
      { code: "fire_within_decade", severity: "success" },
    ]);
    expect(evaluateFireRules({ monthsToFire: 120 })).toEqual([
      { code: "fire_within_decade", severity: "success" },
    ]);
  });

  it("has nothing to say for longer horizons", () => {
    expect(evaluateFireRules({ monthsToFire: 121 })).toEqual([]);
    expect(evaluateFireRules({ monthsToFire: 360 })).toEqual([]);
  });
});
