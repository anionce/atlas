"use client";

import { useEffect } from "react";

import { configureAnalytics, ConsoleAnalyticsProvider } from "@atlas/analytics";

/**
 * Configura el proveedor de analítica una vez, al cargar la app. En
 * desarrollo usamos el proveedor de consola para poder ver los eventos;
 * en producción, hasta que se conecte un proveedor real (GA4, Plausible...),
 * se queda en el no-op por defecto del paquete.
 */
export function AnalyticsBootstrap() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      configureAnalytics(new ConsoleAnalyticsProvider());
    }
  }, []);

  return null;
}
