import { describe, expect, it } from "vitest";

import { generateCanonical, generateMetadata } from "./metadata";

describe("generateCanonical", () => {
  it("resolves a path against the site URL", () => {
    expect(generateCanonical("/comprar-vivienda")).toBe("https://atlas.example/comprar-vivienda");
  });
});

describe("generateMetadata", () => {
  it("builds title, description, canonical and Open Graph consistently", () => {
    const metadata = generateMetadata({
      title: "Calculadora de hipoteca",
      description: "Calcula tu cuota mensual.",
      path: "/comprar-vivienda",
    });

    expect(metadata.title).toBe("Calculadora de hipoteca");
    expect(metadata.description).toBe("Calcula tu cuota mensual.");
    expect(metadata.alternates).toEqual({ canonical: "https://atlas.example/comprar-vivienda" });
    expect(metadata.openGraph?.title).toBe("Calculadora de hipoteca");
    expect(metadata.openGraph?.url).toBe("https://atlas.example/comprar-vivienda");
  });

  it("defaults the locale to es_ES", () => {
    const metadata = generateMetadata({ title: "t", description: "d", path: "/" });
    expect(metadata.openGraph?.locale).toBe("es_ES");
  });
});
