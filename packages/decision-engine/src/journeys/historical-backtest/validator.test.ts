import { describe, expect, it } from "vitest";

import { DecisionValidationError } from "../../errors";
import { validateHistoricalBacktestInput } from "./validator";
import type { HistoricalBacktestInputValues } from "./types";

const validValues: HistoricalBacktestInputValues = {
  initialPortfolio: 1_000_000,
  monthlyExpenses: 3_000,
  stockAllocationPct: 80,
  years: 30,
  withdrawalStrategyId: "constantDollar",
};

describe("validateHistoricalBacktestInput", () => {
  it("accepts valid input without throwing", () => {
    expect(() => validateHistoricalBacktestInput(validValues)).not.toThrow();
  });

  it("rejects a non-positive initial portfolio", () => {
    expect(() => validateHistoricalBacktestInput({ ...validValues, initialPortfolio: 0 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a non-positive monthly expenses", () => {
    expect(() => validateHistoricalBacktestInput({ ...validValues, monthlyExpenses: 0 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects a stock allocation outside 0-100%", () => {
    expect(() =>
      validateHistoricalBacktestInput({ ...validValues, stockAllocationPct: -1 }),
    ).toThrow(DecisionValidationError);
    expect(() =>
      validateHistoricalBacktestInput({ ...validValues, stockAllocationPct: 101 }),
    ).toThrow(DecisionValidationError);
  });

  it("rejects a duration outside 5-60 years", () => {
    expect(() => validateHistoricalBacktestInput({ ...validValues, years: 4 })).toThrow(
      DecisionValidationError,
    );
    expect(() => validateHistoricalBacktestInput({ ...validValues, years: 61 })).toThrow(
      DecisionValidationError,
    );
  });

  it("rejects an invalid withdrawal strategy id", () => {
    expect(() =>
      validateHistoricalBacktestInput({
        ...validValues,
        // @ts-expect-error probando un valor inválido a propósito
        withdrawalStrategyId: "not-a-real-strategy",
      }),
    ).toThrow(DecisionValidationError);
  });
});
