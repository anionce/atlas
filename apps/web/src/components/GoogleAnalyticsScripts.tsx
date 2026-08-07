import Script from "next/script";

/**
 * Carga GA4 solo si hay un ID configurado (variable de entorno
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` en Vercel). Sin esa variable, este
 * componente no renderiza nada — no hay que tocar código para activar o
 * desactivar la analítica, solo la variable de entorno.
 *
 * El consentimiento por defecto es "denied": no se guarda ninguna cookie de
 * GA hasta que el usuario acepta en el banner (ver cookie-consent.ts). Si ya
 * había aceptado en una visita anterior, se restaura ese consentimiento
 * antes de que gtag.js cargue, para no perder la analítica en cada visita.
 */
export function GoogleAnalyticsScripts() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script id="ga-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          var stored = localStorage.getItem("cookie_consent");
          var granted = stored === "granted";
          gtag("consent", "default", {
            analytics_storage: granted ? "granted" : "denied",
            ad_storage: granted ? "granted" : "denied",
            ad_user_data: granted ? "granted" : "denied",
            ad_personalization: granted ? "granted" : "denied"
          });
          gtag("js", new Date());
          gtag("config", "${measurementId}");
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
