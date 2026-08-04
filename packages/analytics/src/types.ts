export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * El resto de la app nunca llama a gtag(...) ni a ningún SDK directamente.
 * Solo habla con esta interfaz, así que cambiar de proveedor (GA4,
 * Plausible, PostHog...) no toca ni una línea fuera de este paquete.
 */
export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
}
