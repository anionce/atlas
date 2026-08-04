import type { AnalyticsEvent, AnalyticsProvider } from "../types";

/**
 * Proveedor para desarrollo: escribe los eventos en consola en vez de
 * enviarlos a ningún sitio. Útil hasta que se conecte un proveedor real
 * (GA4, Plausible, PostHog...), que solo requerirá implementar esta misma
 * interfaz.
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    console.info(`[analytics] ${event.name}`, event.properties ?? {});
  }
}
