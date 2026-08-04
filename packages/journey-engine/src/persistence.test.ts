import { describe, expect, it } from "vitest";

import { MemoryPersistenceAdapter } from "./persistence";
import type { JourneyState } from "./types";

const state: JourneyState = {
  currentStepId: "income",
  answers: { income: 2500 },
  visitedSteps: [],
  completedSteps: [],
  startedAt: "2026-01-01T00:00:00.000Z",
  lastUpdated: "2026-01-01T00:00:00.000Z",
};

describe("MemoryPersistenceAdapter", () => {
  it("returns null for a journey that was never saved", () => {
    const adapter = new MemoryPersistenceAdapter();
    expect(adapter.load("buy-home")).toBeNull();
  });

  it("round-trips a saved state", () => {
    const adapter = new MemoryPersistenceAdapter();
    adapter.save("buy-home", state);
    expect(adapter.load("buy-home")).toEqual(state);
  });

  it("clears a saved state", () => {
    const adapter = new MemoryPersistenceAdapter();
    adapter.save("buy-home", state);
    adapter.clear("buy-home");
    expect(adapter.load("buy-home")).toBeNull();
  });

  it("keeps journeys isolated by id", () => {
    const adapter = new MemoryPersistenceAdapter();
    adapter.save("buy-home", state);
    expect(adapter.load("save-for-goal")).toBeNull();
  });
});
