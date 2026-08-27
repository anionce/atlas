import { describe, expect, it } from "vitest";

import { calculateHistoricalBacktest, constantDollarStrategy } from "./historical-backtest";
import type { HistoricalMarketYear } from "./historical-market-data";

// Dataset sintético pequeño y con cifras redondas, para poder verificar el
// resultado a mano en vez de depender de que los datos reales "cuadren".
const TINY_DATASET: HistoricalMarketYear[] = [
  { year: 2000, stockReturnPct: 10, bondReturnPct: 0, inflationPct: 0 },
  { year: 2001, stockReturnPct: -10, bondReturnPct: 0, inflationPct: 10 },
  { year: 2002, stockReturnPct: 20, bondReturnPct: 0, inflationPct: 0 },
];

describe("calculateHistoricalBacktest", () => {
  it("matches a hand-computed 2-year simulation exactly", () => {
    // 100% en acciones, cartera de 1.000, retirada inicial de 100.
    // Año 1 (2000): retira 100 -> queda 900. Rentabilidad del 10% -> 990.
    // Año 2 (2001): retira 100 (Constant Dollar, sin inflación previa) -> queda 890.
    //   Rentabilidad del -10% -> 801.
    const result = calculateHistoricalBacktest({
      initialPortfolio: 1_000,
      initialAnnualWithdrawal: 100,
      stockAllocationPct: 100,
      years: 2,
      dataset: TINY_DATASET,
    });

    const first = result.simulations.find((s) => s.startYear === 2000);
    expect(first?.endingBalance).toBeCloseTo(801, 6);
    expect(first?.success).toBe(true);
  });

  it("inflation-adjusts the withdrawal in the second year under Constant Dollar", () => {
    // Ventana que empieza en 2001 (año 0 = 2001, año 1 = 2002):
    // Año 0: retira 100 -> 1.000 - 100 = 900; rentabilidad de 2001 (-10%) -> 810.
    // Año 1: retirada ajustada por la inflación de 2001 (10%): 100 * 1,10 = 110.
    //   810 - 110 = 700; rentabilidad de 2002 (+20%) -> 700 * 1,20 = 840.
    const result = calculateHistoricalBacktest({
      initialPortfolio: 1_000,
      initialAnnualWithdrawal: 100,
      stockAllocationPct: 100,
      years: 2,
      dataset: TINY_DATASET,
    });

    const secondWindow = result.simulations.find((s) => s.startYear === 2001);
    expect(secondWindow?.endingBalance).toBeCloseTo(840, 6);
  });

  it("marks a simulation as failed once the portfolio is fully depleted", () => {
    const result = calculateHistoricalBacktest({
      initialPortfolio: 150,
      initialAnnualWithdrawal: 100,
      stockAllocationPct: 100,
      years: 2,
      dataset: TINY_DATASET,
    });

    const first = result.simulations.find((s) => s.startYear === 2000);
    // 150 - 100 = 50, crece a 55; año 2 retira 100 (Constant Dollar, sin
    // inflación en el año 0) -> 55 - 100 < 0 -> se agota.
    expect(first?.success).toBe(false);
    expect(first?.endingBalance).toBe(0);
    expect(first?.depletedAtYearIndex).toBe(1);
  });

  it("runs one simulation per possible historical starting window", () => {
    const result = calculateHistoricalBacktest({
      initialPortfolio: 1_000,
      initialAnnualWithdrawal: 40,
      stockAllocationPct: 60,
      years: 2,
      dataset: TINY_DATASET,
    });
    // 3 años de datos, ventanas de 2 años -> 2 ventanas posibles (2000-2001, 2001-2002).
    expect(result.totalSimulations).toBe(2);
    expect(result.simulations.map((s) => s.startYear)).toEqual([2000, 2001]);
  });

  it("a 0% withdrawal never depletes the portfolio", () => {
    const result = calculateHistoricalBacktest({
      initialPortfolio: 1_000,
      initialAnnualWithdrawal: 0,
      stockAllocationPct: 80,
      years: 30,
    });
    expect(result.successRatePct).toBe(100);
  });

  describe("using the real US historical dataset (1928-2025)", () => {
    it("success rate never increases as the withdrawal rate goes up, all else equal", () => {
      const low = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 30_000,
        stockAllocationPct: 80,
        years: 30,
      });
      const mid = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 80,
        years: 30,
      });
      const high = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 60_000,
        stockAllocationPct: 80,
        years: 30,
      });
      expect(mid.successRatePct).toBeLessThanOrEqual(low.successRatePct);
      expect(high.successRatePct).toBeLessThanOrEqual(mid.successRatePct);
    });

    it("falls within the range the retirement-research literature reports for the classic 4% rule", () => {
      // El Trinity Study original (1926-1995, 50/50) encontró un 95% a 30
      // años. Nuestro dataset empieza en 1928 y usa una cartera 80/20, así
      // que no esperamos el mismo número exacto — pero sí que caiga dentro
      // de un rango amplio y bien documentado, no muy lejos de ese 95%.
      const result = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 80,
        years: 30,
      });
      expect(result.successRatePct).toBeGreaterThanOrEqual(80);
      expect(result.successRatePct).toBeLessThanOrEqual(100);
    });

    it("computes exactly one simulation per possible 30-year window in 98 years of data", () => {
      const result = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 80,
        years: 30,
      });
      // 98 años de datos, ventanas de 30 -> 98 - 30 + 1 = 69 ventanas.
      expect(result.totalSimulations).toBe(69);
    });

    it("a longer retirement horizon never has a higher success rate than a shorter one, all else equal", () => {
      const thirtyYears = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 80,
        years: 30,
      });
      const fiftyYears = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 80,
        years: 50,
      });
      expect(fiftyYears.successRatePct).toBeLessThanOrEqual(thirtyYears.successRatePct);
    });
  });
});

describe("constantDollarStrategy", () => {
  it("withdraws exactly the initial amount in the first year", () => {
    const withdrawal = constantDollarStrategy({
      portfolioBalance: 1_000,
      previousWithdrawal: 0,
      yearIndex: 0,
      previousYearInflationPct: 0,
      initialWithdrawal: 40,
    });
    expect(withdrawal).toBe(40);
  });

  it("inflation-adjusts the withdrawal for every year after the first", () => {
    const withdrawal = constantDollarStrategy({
      portfolioBalance: 1_000,
      previousWithdrawal: 40,
      yearIndex: 1,
      previousYearInflationPct: 5,
      initialWithdrawal: 40,
    });
    expect(withdrawal).toBeCloseTo(42, 6);
  });
});
