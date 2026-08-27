import { describe, expect, it } from "vitest";

import { calculateAverageHistoricalReturn } from "./historical-average-return";
import type { HistoricalMarketYear } from "./historical-market-data";

const TINY_DATASET: HistoricalMarketYear[] = [
  { year: 2000, stockReturnPct: 10, bondReturnPct: 2, inflationPct: 0 },
  { year: 2001, stockReturnPct: -10, bondReturnPct: 4, inflationPct: 0 },
  { year: 2002, stockReturnPct: 20, bondReturnPct: 6, inflationPct: 0 },
];

describe("calculateAverageHistoricalReturn", () => {
  it("averages the blended stock/bond return across every year in the dataset", () => {
    // 100% acciones: media de 10, -10, 20 = 20/3.
    expect(calculateAverageHistoricalReturn(100, TINY_DATASET)).toBeCloseTo(20 / 3, 6);
  });

  it("uses only bonds when the stock allocation is 0%", () => {
    // 100% bonos: media de 2, 4, 6 = 4.
    expect(calculateAverageHistoricalReturn(0, TINY_DATASET)).toBeCloseTo(4, 6);
  });

  it("blends proportionally for a mixed allocation", () => {
    const result = calculateAverageHistoricalReturn(50, TINY_DATASET);
    const expected = (20 / 3) * 0.5 + 4 * 0.5;
    expect(result).toBeCloseTo(expected, 6);
  });

  it("returns 0 for an empty dataset instead of dividing by zero", () => {
    expect(calculateAverageHistoricalReturn(80, [])).toBe(0);
  });
});
