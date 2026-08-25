import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "./site-config";
import type { SeoConfig } from "./types";

export function generateCanonical(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * Toda página consume esta función en vez de escribir sus propios
 * metadatos sueltos, para que title/description/OG/canonical se
 * construyan siempre igual.
 */
export function generateMetadata(config: SeoConfig): Metadata {
  const canonical = generateCanonical(config.path);
  const locale = config.locale ?? "es_ES";
  // `opengraph-image.tsx` en app/ solo se aplica a la home: no se hereda a
  // rutas anidadas como layout.tsx, así que cada página lo referencia aquí
  // explícitamente para compartir la misma imagen de marca.
  const ogImageUrl = generateCanonical("/opengraph-image");

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonical,
      siteName: SITE_NAME,
      locale,
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [ogImageUrl],
    },
  };
}
