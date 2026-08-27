import { describe, expect, it } from "vitest";

import { calculateHistoricalBacktest } from "./historical-backtest";
import {
  createGuytonKlingerStrategy,
  createOneOverNStrategy,
  createPercentOfPortfolioStrategy,
  createVpwStrategy,
} from "./withdrawal-strategies";
import type { HistoricalMarketYear } from "./historical-market-data";

const baseContext = {
  portfolioBalance: 1_000,
  previousWithdrawal: 40,
  yearIndex: 1,
  previousYearInflationPct: 3,
  previousYearPortfolioReturnPct: 5,
  initialWithdrawal: 40,
  initialPortfolioBalance: 1_000,
};

describe("createPercentOfPortfolioStrategy", () => {
  it("withdraws a fixed percentage of the current balance, not the initial one", () => {
    const strategy = createPercentOfPortfolioStrategy(4);
    expect(strategy({ ...baseContext, portfolioBalance: 500 })).toBeCloseTo(20, 6);
    expect(strategy({ ...baseContext, portfolioBalance: 2_000 })).toBeCloseTo(80, 6);
  });

  it("mathematically never fully depletes the portfolio", () => {
    const result = calculateHistoricalBacktest({
      initialPortfolio: 1_000_000,
      initialAnnualWithdrawal: 40_000,
      stockAllocationPct: 80,
      years: 30,
      strategy: createPercentOfPortfolioStrategy(4),
    });
    expect(result.successRatePct).toBe(100);
  });
});

describe("createOneOverNStrategy", () => {
  it("divides the current balance by the years remaining", () => {
    const strategy = createOneOverNStrategy(30);
    // Año 0: quedan 30 años.
    expect(strategy({ ...baseContext, yearIndex: 0, portfolioBalance: 300 })).toBeCloseTo(10, 6);
    // Año 10: quedan 20 años.
    expect(strategy({ ...baseContext, yearIndex: 10, portfolioBalance: 400 })).toBeCloseTo(20, 6);
  });

  it("withdraws the entire remaining balance in the final year", () => {
    const strategy = createOneOverNStrategy(30);
    const withdrawal = strategy({ ...baseContext, yearIndex: 29, portfolioBalance: 12_345 });
    expect(withdrawal).toBeCloseTo(12_345, 6);
  });
});

describe("createVpwStrategy", () => {
  it("matches 1/N exactly when the expected return is 0%", () => {
    const vpw = createVpwStrategy(30, 0);
    const oneOverN = createOneOverNStrategy(30);
    const context = { ...baseContext, yearIndex: 12, portfolioBalance: 456 };
    expect(vpw(context)).toBeCloseTo(oneOverN(context), 6);
  });

  it("withdraws a larger share than 1/N when a positive return is expected", () => {
    // 1/N ignora por completo la rentabilidad futura (reparto ingenuo a
    // partes iguales). VPW, en cambio, "adelanta" el crecimiento que
    // espera de lo que queda invertido, así que para el mismo punto de la
    // jubilación permite retirar un porcentaje mayor sin dejar de llegar
    // exactamente a cero en el último año.
    const vpw = createVpwStrategy(30, 5);
    const oneOverN = createOneOverNStrategy(30);
    const context = { ...baseContext, yearIndex: 5, portfolioBalance: 1_000 };
    expect(vpw(context)).toBeGreaterThan(oneOverN(context));
  });

  it("withdraws the entire remaining balance in the final year, same as 1/N", () => {
    const vpw = createVpwStrategy(30, 5);
    const withdrawal = vpw({ ...baseContext, yearIndex: 29, portfolioBalance: 7_890 });
    expect(withdrawal).toBeCloseTo(7_890, 6);
  });
});

describe("createGuytonKlingerStrategy", () => {
  it("withdraws exactly the initial amount in the first year", () => {
    const strategy = createGuytonKlingerStrategy();
    expect(strategy({ ...baseContext, yearIndex: 0 })).toBe(40);
  });

  it("freezes the inflation adjustment the year after a portfolio loss", () => {
    const strategy = createGuytonKlingerStrategy();
    const withdrawal = strategy({
      ...baseContext,
      previousYearPortfolioReturnPct: -8,
      previousYearInflationPct: 3,
      previousWithdrawal: 40,
      portfolioBalance: 1_000,
    });
    // Sin la congelación sería 40 * 1,03 = 41,2 — congelado, se queda en 40
    // (ni guardarraíl entra en juego: 40/1.000 = 4% = tasa inicial exacta).
    expect(withdrawal).toBe(40);
  });

  it("cuts the withdrawal 10% when the capital preservation guardrail is hit", () => {
    const strategy = createGuytonKlingerStrategy();
    // Tasa inicial: 40/1.000 = 4%. Si la cartera cae a 300, una retirada de
    // 41,2 supondría una tasa de 41,2/300 ≈ 13,7% — muy por encima del 20%
    // de margen sobre el 4% inicial (4,8%), así que se activa la regla de
    // preservación de capital.
    const withdrawal = strategy({
      ...baseContext,
      portfolioBalance: 300,
      previousYearPortfolioReturnPct: 5,
      previousYearInflationPct: 3,
      previousWithdrawal: 40,
    });
    expect(withdrawal).toBeCloseTo(41.2 * 0.9, 6);
  });

  it("raises the withdrawal 10% when the prosperity guardrail is hit", () => {
    const strategy = createGuytonKlingerStrategy();
    // Cartera creció mucho: una retirada de 41,2 sobre una cartera de
    // 10.000 es una tasa del 0,412%, muy por debajo del 80% del 4% inicial
    // (3,2%), así que se activa la regla de prosperidad.
    const withdrawal = strategy({
      ...baseContext,
      portfolioBalance: 10_000,
      previousYearPortfolioReturnPct: 5,
      previousYearInflationPct: 3,
      previousWithdrawal: 40,
    });
    expect(withdrawal).toBeCloseTo(41.2 * 1.1, 6);
  });

  describe("using the real US historical dataset (1928-2025)", () => {
    it("never withdraws a negative amount across every historical window", () => {
      const result = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 50_000,
        stockAllocationPct: 80,
        years: 30,
        strategy: createGuytonKlingerStrategy(),
      });
      expect(result.totalSimulations).toBeGreaterThan(0);
      for (const sim of result.simulations) {
        expect(sim.endingBalance).toBeGreaterThanOrEqual(0);
      }
    });

    it("the dynamic guardrails never reduce the success rate versus plain Constant Dollar, at an aggressive withdrawal rate", () => {
      // A un tipo de retirada donde el 4% fijo empieza a fallar, los
      // guardarraíles (que recortan gasto en años malos) deberían igualar o
      // mejorar la tasa de éxito frente a mantener la retirada fija.
      const constantDollarResult = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 55_000,
        stockAllocationPct: 80,
        years: 30,
      });
      const guytonKlingerResult = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 55_000,
        stockAllocationPct: 80,
        years: 30,
        strategy: createGuytonKlingerStrategy(),
      });
      expect(guytonKlingerResult.successRatePct).toBeGreaterThanOrEqual(
        constantDollarResult.successRatePct,
      );
    });
  });
});

describe("cross-strategy sanity check with a synthetic dataset", () => {
  const STEADY_GROWTH: HistoricalMarketYear[] = Array.from({ length: 10 }, (_, i) => ({
    year: 2000 + i,
    stockReturnPct: 6,
    bondReturnPct: 6,
    inflationPct: 2,
  }));

  it("all four strategies keep the portfolio solvent through a steady-growth sequence", () => {
    const strategies = {
      percentOfPortfolio: createPercentOfPortfolioStrategy(4),
      oneOverN: createOneOverNStrategy(10),
      vpw: createVpwStrategy(10, 6),
      guytonKlinger: createGuytonKlingerStrategy(),
    };

    for (const strategy of Object.values(strategies)) {
      const result = calculateHistoricalBacktest({
        initialPortfolio: 1_000_000,
        initialAnnualWithdrawal: 40_000,
        stockAllocationPct: 50,
        years: 10,
        strategy,
        dataset: STEADY_GROWTH,
      });
      expect(result.successRatePct).toBe(100);
    }
  });
});
