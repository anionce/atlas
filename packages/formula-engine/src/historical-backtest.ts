import { US_HISTORICAL_MARKET_RETURNS, type HistoricalMarketYear } from "./historical-market-data";

export interface WithdrawalStrategyContext {
  /** Balance de la cartera al empezar el año, antes de retirar. */
  portfolioBalance: number;
  /** Retirada del año anterior (0 en el primer año). */
  previousWithdrawal: number;
  /** Año dentro de la simulación: 0 es el primer año. */
  yearIndex: number;
  /** Inflación del año anterior, en %. `0` en el primer año (no hay año anterior). */
  previousYearInflationPct: number;
  /** Retirada inicial tal como la configuró quien simula (año 0). */
  initialWithdrawal: number;
}

/**
 * Decide cuánto se retira cada año de la simulación. Recibe el estado de
 * ese año y devuelve el importe a retirar — nunca muta nada, así que se
 * pueden intercambiar estrategias sin tocar el motor de simulación.
 */
export type WithdrawalStrategy = (context: WithdrawalStrategyContext) => number;

/**
 * "Constant Dollar": la estrategia clásica de la regla del 4% (Trinity
 * Study). Retira el mismo importe real cada año — el primer año retira lo
 * que se haya configurado, y cada año siguiente ajusta esa cantidad por la
 * inflación del año anterior, para mantener el poder adquisitivo constante.
 */
export const constantDollarStrategy: WithdrawalStrategy = (context) => {
  if (context.yearIndex === 0) return context.initialWithdrawal;
  return context.previousWithdrawal * (1 + context.previousYearInflationPct / 100);
};

export interface HistoricalBacktestInput {
  initialPortfolio: number;
  /** Retirada del primer año, en euros/dólares de hoy. */
  initialAnnualWithdrawal: number;
  /** % de la cartera en renta variable (acciones); el resto va a bonos. */
  stockAllocationPct: number;
  /** Duración de la jubilación, en años. */
  years: number;
  /** Por defecto, Constant Dollar (la regla del 4% clásica). */
  strategy?: WithdrawalStrategy;
  /** Por defecto, el dataset histórico de EE. UU. 1928-2025. */
  dataset?: HistoricalMarketYear[];
}

export interface HistoricalSimulationResult {
  startYear: number;
  endYear: number;
  /** `true` si la cartera cubrió todas las retiradas hasta el final del período. */
  success: boolean;
  /** Balance al final del período (0 si se agotó antes). */
  endingBalance: number;
  /** Índice del año (0 = primero) en el que se agotó la cartera, o `null` si no se agotó. */
  depletedAtYearIndex: number | null;
}

export interface HistoricalBacktestResult {
  simulations: HistoricalSimulationResult[];
  successRatePct: number;
  successCount: number;
  totalSimulations: number;
}

/**
 * Corre el plan (cartera inicial, asignación, retirada, duración) contra
 * cada ventana histórica posible del dataset — no una sola vez con una
 * rentabilidad media asumida, sino una vez por cada año real en que se
 * podría haber empezado la jubilación. La tasa de éxito es la fracción de
 * esas ventanas en las que el dinero no se agotó.
 *
 * Convención de cada año simulado: primero se retira (ajustada según la
 * estrategia), y el resto de la cartera crece con la rentabilidad de ese
 * año — la misma convención que usa el Trinity Study y la mayoría de
 * simuladores de este tipo (FIRECalc, cFIREsim, FI Calc).
 */
export function calculateHistoricalBacktest(
  input: HistoricalBacktestInput,
): HistoricalBacktestResult {
  const {
    initialPortfolio,
    initialAnnualWithdrawal,
    stockAllocationPct,
    years,
    strategy = constantDollarStrategy,
    dataset = US_HISTORICAL_MARKET_RETURNS,
  } = input;

  const simulations: HistoricalSimulationResult[] = [];
  const maxStartIndex = dataset.length - years;

  for (let startIndex = 0; startIndex <= maxStartIndex; startIndex++) {
    let balance = initialPortfolio;
    let withdrawal = 0;
    let depletedAtYearIndex: number | null = null;

    for (let yearIndex = 0; yearIndex < years; yearIndex++) {
      const yearData = dataset[startIndex + yearIndex];
      if (!yearData) break;

      withdrawal = strategy({
        portfolioBalance: balance,
        previousWithdrawal: withdrawal,
        yearIndex,
        previousYearInflationPct:
          yearIndex === 0 ? 0 : (dataset[startIndex + yearIndex - 1]?.inflationPct ?? 0),
        initialWithdrawal: initialAnnualWithdrawal,
      });

      balance -= withdrawal;
      if (balance <= 0) {
        balance = 0;
        depletedAtYearIndex = yearIndex;
        break;
      }

      const blendedReturnPct =
        (stockAllocationPct / 100) * yearData.stockReturnPct +
        (1 - stockAllocationPct / 100) * yearData.bondReturnPct;
      balance = balance * (1 + blendedReturnPct / 100);
    }

    const firstYear = dataset[startIndex];
    const lastYear = dataset[startIndex + years - 1];
    if (!firstYear || !lastYear) continue;

    simulations.push({
      startYear: firstYear.year,
      endYear: lastYear.year,
      success: depletedAtYearIndex === null,
      endingBalance: balance,
      depletedAtYearIndex,
    });
  }

  const successCount = simulations.filter((s) => s.success).length;

  return {
    simulations,
    successRatePct: simulations.length > 0 ? (successCount / simulations.length) * 100 : 0,
    successCount,
    totalSimulations: simulations.length,
  };
}
