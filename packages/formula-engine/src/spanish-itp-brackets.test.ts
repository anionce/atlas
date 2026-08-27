import { describe, expect, it } from "vitest";

import { calculateItpProgressive, ITP_BRACKETS_BY_REGION } from "./spanish-itp-brackets";

describe("calculateItpProgressive", () => {
  it("matches Cataluña's official worked example: 800.000 € -> 82.000 €", () => {
    const tax = calculateItpProgressive(800_000, ITP_BRACKETS_BY_REGION.cataluna!);
    // 10% de 600.000 (60.000) + 11% de los 200.000 restantes (22.000) = 82.000.
    expect(tax).toBeCloseTo(82_000, 6);
  });

  it("matches Asturias's official worked example: 400.000 € -> 33.000 €", () => {
    const tax = calculateItpProgressive(400_000, ITP_BRACKETS_BY_REGION.asturias!);
    // 8% de 300.000 (24.000) + 9% de los 100.000 restantes (9.000) = 33.000.
    expect(tax).toBeCloseTo(33_000, 6);
  });

  it("taxes the whole amount at the first bracket's rate when fully within it", () => {
    const tax = calculateItpProgressive(500_000, ITP_BRACKETS_BY_REGION.cataluna!);
    expect(tax).toBeCloseTo(500_000 * 0.1, 6);
  });

  it("applies every bracket in order for a very high price", () => {
    const tax = calculateItpProgressive(2_000_000, ITP_BRACKETS_BY_REGION.cataluna!);
    // 10% de 600.000 + 11% de 300.000 + 12% de 600.000 + 13% de 500.000
    const expected = 600_000 * 0.1 + 300_000 * 0.11 + 600_000 * 0.12 + 500_000 * 0.13;
    expect(tax).toBeCloseTo(expected, 6);
  });

  it("returns 0 for a non-positive price", () => {
    expect(calculateItpProgressive(0, ITP_BRACKETS_BY_REGION.cataluna!)).toBe(0);
    expect(calculateItpProgressive(-100, ITP_BRACKETS_BY_REGION.cataluna!)).toBe(0);
  });

  it("always costs at least as much as it would at the lowest bracket's flat rate", () => {
    // Sanity check de coherencia: nunca puede salir más barato que tributar
    // todo al tipo más bajo (el impuesto progresivo siempre es >= tipo mínimo × precio).
    for (const brackets of Object.values(ITP_BRACKETS_BY_REGION)) {
      const lowestRatePct = brackets![0]!.ratePct;
      for (const price of [100_000, 500_000, 1_200_000, 3_000_000]) {
        const tax = calculateItpProgressive(price, brackets!);
        expect(tax).toBeGreaterThanOrEqual(price * (lowestRatePct / 100) - 1e-6);
      }
    }
  });
});
