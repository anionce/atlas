import { describe, expect, it } from "vitest";

import { generateBreadcrumbSchema, generateFAQSchema, generateSchema } from "./schema";

describe("generateFAQSchema", () => {
  it("produces a valid FAQPage JSON-LD structure", () => {
    const schema = generateFAQSchema([{ question: "¿Qué es el ITP?", answer: "Un impuesto." }]);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "¿Qué es el ITP?",
        acceptedAnswer: { "@type": "Answer", text: "Un impuesto." },
      },
    ]);
  });
});

describe("generateBreadcrumbSchema", () => {
  it("numbers items starting at 1 and resolves canonical URLs", () => {
    const schema = generateBreadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Comprar vivienda", path: "/comprar-vivienda" },
    ]);
    expect(schema.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.mirumbofinanciero.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Comprar vivienda",
        item: "https://www.mirumbofinanciero.com/comprar-vivienda",
      },
    ]);
  });
});

describe("generateSchema", () => {
  it("describes the tool as a free WebApplication", () => {
    const schema = generateSchema({
      name: "Calculadora de hipoteca",
      description: "Calcula tu cuota mensual.",
      path: "/comprar-vivienda",
    });
    expect(schema["@type"]).toBe("WebApplication");
    expect(schema.applicationCategory).toBe("FinanceApplication");
    expect(schema.offers).toEqual({ "@type": "Offer", price: "0", priceCurrency: "EUR" });
  });
});
