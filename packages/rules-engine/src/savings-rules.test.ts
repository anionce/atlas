import { describe, expect, it } from "vitest";

import { evaluateSavingsRules } from "./savings-rules";

describe("evaluateSavingsRules", () => {
  it("is sufficient when savings cover the required entry", () => {
    expect(evaluateSavingsRules({ savings: 50_000, requiredEntry: 40_000 })).toEqual([
      { code: "sufficient_savings", severity: "success" },
    ]);
  });

  it("is insufficient when savings fall short", () => {
    expect(evaluateSavingsRules({ savings: 20_000, requiredEntry: 40_000 })).toEqual([
      { code: "insufficient_savings", severity: "warning" },
    ]);
  });
});
