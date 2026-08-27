import { describe, expect, it } from "vitest";

import { US_HISTORICAL_MARKET_RETURNS } from "./historical-market-data";

describe("US_HISTORICAL_MARKET_RETURNS", () => {
  it("covers 1928 through 2025 with no gaps", () => {
    expect(US_HISTORICAL_MARKET_RETURNS.length).toBe(98);
    expect(US_HISTORICAL_MARKET_RETURNS[0]?.year).toBe(1928);
    expect(US_HISTORICAL_MARKET_RETURNS.at(-1)?.year).toBe(2025);

    for (let i = 1; i < US_HISTORICAL_MARKET_RETURNS.length; i++) {
      expect(US_HISTORICAL_MARKET_RETURNS[i]?.year).toBe(
        (US_HISTORICAL_MARKET_RETURNS[i - 1]?.year ?? 0) + 1,
      );
    }
  });

  it("has no NaN or missing values in any field", () => {
    for (const entry of US_HISTORICAL_MARKET_RETURNS) {
      expect(Number.isFinite(entry.stockReturnPct)).toBe(true);
      expect(Number.isFinite(entry.bondReturnPct)).toBe(true);
      expect(Number.isFinite(entry.inflationPct)).toBe(true);
    }
  });

  it("keeps every field within plausible historical bounds (catches transcription typos)", () => {
    for (const entry of US_HISTORICAL_MARKET_RETURNS) {
      expect(entry.stockReturnPct).toBeGreaterThan(-50);
      expect(entry.stockReturnPct).toBeLessThan(60);
      expect(entry.bondReturnPct).toBeGreaterThan(-25);
      expect(entry.bondReturnPct).toBeLessThan(35);
      expect(entry.inflationPct).toBeGreaterThan(-15);
      expect(entry.inflationPct).toBeLessThan(20);
    }
  });

  it("matches well-known historical facts as spot checks", () => {
    const byYear = new Map(US_HISTORICAL_MARKET_RETURNS.map((e) => [e.year, e]));

    // La Gran Depresión: 1931 fue el peor año bursátil del dataset.
    expect(byYear.get(1931)?.stockReturnPct).toBeCloseTo(-43.84, 1);
    // La crisis financiera de 2008.
    expect(byYear.get(2008)?.stockReturnPct).toBeCloseTo(-36.55, 1);
    // 2022: caída simultánea e inusual de acciones y bonos.
    expect(byYear.get(2022)?.stockReturnPct).toBeLessThan(0);
    expect(byYear.get(2022)?.bondReturnPct).toBeLessThan(0);
    // La inflación de la crisis del petróleo de los 70.
    expect(byYear.get(1974)?.inflationPct).toBeGreaterThan(10);
    // 2009: inflación negativa (deflación) tras la crisis financiera.
    expect(byYear.get(2009)?.inflationPct).toBeLessThan(0);
  });
});
