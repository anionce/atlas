import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { PurchaseCostsJourneyClient } from "@/features/housing/components/PurchaseCostsJourneyClient";

const TITLE = "Calculadora de gastos de compra de vivienda (ITP/IVA)";
const DESCRIPTION =
  "Descubre cuánto pagarías en impuestos, notaría, registro y tasación al comprar una vivienda, según sea nueva o de segunda mano.";
const PATH = "/gastos-compra-vivienda";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const toolSchema = generateSchema({
  name: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Inicio", path: "/" },
  { name: "Gastos de compra", path: PATH },
]);

export default function GastosCompraViviendaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PurchaseCostsJourneyClient />
    </>
  );
}
