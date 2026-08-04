import type { AnalyticsProvider } from "../types";

/** Proveedor por defecto: no hace nada. Seguro para tests y SSR. */
export class NoopAnalyticsProvider implements AnalyticsProvider {
  track(): void {
    // Intencionadamente vacío.
  }
}
