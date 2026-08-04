import { generateCanonical } from "./metadata";
import type { BreadcrumbItem, FaqItem, ToolSchemaConfig } from "./types";

/** JSON-LD para una página con preguntas frecuentes. */
export function generateFAQSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** JSON-LD de las migas de pan, para que Google las muestre en el resultado de búsqueda. */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: generateCanonical(item.path),
    })),
  };
}

/** JSON-LD que describe una herramienta (Journey) como WebApplication. */
export function generateSchema(config: ToolSchemaConfig): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.name,
    description: config.description,
    url: generateCanonical(config.path),
    applicationCategory: config.applicationCategory ?? "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}
