import { afterEach, describe, expect, it, vi } from "vitest";

import { GtagAnalyticsProvider } from "./gtag-provider";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GtagAnalyticsProvider", () => {
  it("forwards events to window.gtag", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    new GtagAnalyticsProvider().track({ name: "journey_started", properties: { journeyId: "x" } });

    expect(gtag).toHaveBeenCalledWith("event", "journey_started", { journeyId: "x" });
  });

  it("defaults properties to an empty object", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    new GtagAnalyticsProvider().track({ name: "journey_started" });

    expect(gtag).toHaveBeenCalledWith("event", "journey_started", {});
  });

  it("does nothing if window is undefined (SSR)", () => {
    expect(() => new GtagAnalyticsProvider().track({ name: "journey_started" })).not.toThrow();
  });

  it("does nothing if window.gtag is not defined", () => {
    vi.stubGlobal("window", {});

    expect(() => new GtagAnalyticsProvider().track({ name: "journey_started" })).not.toThrow();
  });
});
