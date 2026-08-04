import { beforeEach, describe, expect, it, vi } from "vitest";

import { configureAnalytics } from "./config";
import {
  trackJourneyCompleted,
  trackJourneyStarted,
  trackRecommendationClicked,
  trackScenarioCompared,
  trackValidationFailed,
} from "./events";
import type { AnalyticsEvent, AnalyticsProvider } from "./types";

class RecordingProvider implements AnalyticsProvider {
  events: AnalyticsEvent[] = [];
  track(event: AnalyticsEvent): void {
    this.events.push(event);
  }
}

describe("semantic tracking functions", () => {
  let provider: RecordingProvider;

  beforeEach(() => {
    provider = new RecordingProvider();
    configureAnalytics(provider);
  });

  it("never call the provider directly with a raw event name string", () => {
    // Comprobamos que cada función semántica produce el nombre de evento
    // correcto, para que nadie llame a provider.track(...) suelto en la app.
    trackJourneyStarted({ journeyId: "buy-home" });
    expect(provider.events).toEqual([
      { name: "journey_started", properties: { journeyId: "buy-home" } },
    ]);
  });

  it("tracks journey completion with the journey id", () => {
    trackJourneyCompleted({ journeyId: "buy-home" });
    expect(provider.events[0]).toEqual({
      name: "journey_completed",
      properties: { journeyId: "buy-home" },
    });
  });

  it("tracks a validation failure with the offending step", () => {
    trackValidationFailed({ journeyId: "buy-home", stepId: "monthlyIncome" });
    expect(provider.events[0]?.properties).toEqual({
      journeyId: "buy-home",
      stepId: "monthlyIncome",
    });
  });

  it("tracks scenario comparisons with all compared scenario ids", () => {
    trackScenarioCompared({ journeyId: "buy-home", scenarioIds: ["today", "wait-a-year"] });
    expect(provider.events[0]?.properties).toEqual({
      journeyId: "buy-home",
      scenarioIds: ["today", "wait-a-year"],
    });
  });

  it("tracks which recommendation was clicked", () => {
    trackRecommendationClicked({ journeyId: "buy-home", recommendationId: "wait_and_save" });
    expect(provider.events[0]?.properties?.recommendationId).toBe("wait_and_save");
  });
});

describe("provider swapping", () => {
  it("uses vi.fn to verify the active provider is the one that gets called", () => {
    const track = vi.fn();
    configureAnalytics({ track });
    trackJourneyStarted({ journeyId: "buy-home" });
    expect(track).toHaveBeenCalledOnce();
  });
});
