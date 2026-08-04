import { NoopAnalyticsProvider } from "./providers/noop-provider";
import type { AnalyticsProvider } from "./types";

let activeProvider: AnalyticsProvider = new NoopAnalyticsProvider();

export function configureAnalytics(provider: AnalyticsProvider): void {
  activeProvider = provider;
}

export function getAnalyticsProvider(): AnalyticsProvider {
  return activeProvider;
}
