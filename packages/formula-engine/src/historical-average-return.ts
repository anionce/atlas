import { US_HISTORICAL_MARKET_RETURNS, type HistoricalMarketYear } from "./historical-market-data";

/**
 * Rentabilidad media histórica (media aritmética simple, no compuesta) de
 * una cartera acciones/bonos con esta asignación, usando el dataset
 * histórico. Se usa como estimación de "rentabilidad esperada" para VPW,
 * que la necesita para calcular su factor de anualidad — no hace falta
 * preguntársela a quien usa la calculadora, ya se puede derivar de la
 * misma asignación que ya ha elegido.
 */
export function calculateAverageHistoricalReturn(
  stockAllocationPct: number,
  dataset: HistoricalMarketYear[] = US_HISTORICAL_MARKET_RETURNS,
): number {
  if (dataset.length === 0) return 0;

  const total = dataset.reduce((sum, year) => {
    const blended =
      (stockAllocationPct / 100) * year.stockReturnPct +
      (1 - stockAllocationPct / 100) * year.bondReturnPct;
    return sum + blended;
  }, 0);

  return total / dataset.length;
}
