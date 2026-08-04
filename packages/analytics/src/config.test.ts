import { describe, expect, it } from "vitest";

import { getAnalyticsProvider } from "./config";
import { NoopAnalyticsProvider } from "./providers/noop-provider";

describe("getAnalyticsProvider", () => {
  it("defaults to a no-op provider so tracking is always safe to call", () => {
    expect(getAnalyticsProvider()).toBeInstanceOf(NoopAnalyticsProvider);
  });
});
