"use client";

import { useEffect } from "react";

import {
  configureAnalytics,
  ConsoleAnalyticsProvider,
  GtagAnalyticsProvider,
} from "@atlas/analytics";

/**
 * Configura el proveedor de analítica una vez, al cargar la app. En
 * desarrollo usamos el proveedor de consola para poder ver los eventos. En
 * producción, si hay un GA4 configurado (`NEXT_PUBLIC_GA_MEASUREMENT_ID`),
 * los eventos se envían a GA4 — respetando el consentimiento de cookies vía
 * Consent Mode, gestionado en GoogleAnalyticsScripts/CookieConsentBanner.
 * Sin esa variable, se queda en el no-op por defecto del paquete.
 */
export function AnalyticsBootstrap() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      configureAnalytics(new ConsoleAnalyticsProvider());
    } else if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      configureAnalytics(new GtagAnalyticsProvider());
    }
  }, []);

  return null;
}
