import type { AnalyticsEvent, AnalyticsProvider } from "../types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Envía eventos a Google Analytics 4 vía `window.gtag`, que debe haber sido
 * inicializado por el script de GA cargado en el layout de la app. Si el
 * script todavía no ha cargado (o GA no está configurado), no hace nada en
 * vez de fallar.
 */
export class GtagAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", event.name, event.properties ?? {});
  }
}
