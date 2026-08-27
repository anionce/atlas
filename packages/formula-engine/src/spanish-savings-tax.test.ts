import { describe, expect, it } from "vitest";

import { calculateSpanishSavingsTax } from "./spanish-savings-tax";

describe("calculateSpanishSavingsTax", () => {
  it("returns 0 for a non-positive amount", () => {
    expect(calculateSpanishSavingsTax(0)).toBe(0);
    expect(calculateSpanishSavingsTax(-100)).toBe(0);
  });

  it("applies the first bracket's rate when fully within it", () => {
    expect(calculateSpanishSavingsTax(5_000)).toBeCloseTo(5_000 * 0.19, 6);
  });

  it("taxes only the portion of the amount within each bracket, not the whole amount at the top rate", () => {
    // 6.000 € al 19 % + 4.000 € al 21 %, no 10.000 € al 21 %.
    expect(calculateSpanishSavingsTax(10_000)).toBeCloseTo(6_000 * 0.19 + 4_000 * 0.21, 6);
  });

  it("applies every bracket in order for a large amount", () => {
    const expected = 6_000 * 0.19 + 44_000 * 0.21 + 150_000 * 0.23 + 100_000 * 0.27 + 50_000 * 0.3;
    expect(calculateSpanishSavingsTax(350_000)).toBeCloseTo(expected, 6);
  });

  it("accepts a custom set of brackets instead of the 2026 default", () => {
    const flatBracket = [{ upTo: null, ratePct: 10 }];
    expect(calculateSpanishSavingsTax(1_000, flatBracket)).toBeCloseTo(100, 6);
  });
});
