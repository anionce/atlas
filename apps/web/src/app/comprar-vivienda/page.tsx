import type { Metadata } from "next";

import {
  generateBreadcrumbSchema,
  generateMetadata as buildSeoMetadata,
  generateSchema,
} from "@atlas/seo";

import { BuyHomeJourneyClient } from "@/features/housing/components/BuyHomeJourneyClient";

const TITLE = "Simulador para comprar una vivienda";
const DESCRIPTION =
  "Descubre cuánto puedes gastar en una vivienda, la cuota estimada y los gastos de compra a partir de tus ingresos y tu ahorro.";
const PATH = "/comprar-vivienda";

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
  { name: "Comprar vivienda", path: PATH },
]);

export default function ComprarViviendaPage() {
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
      <BuyHomeJourneyClient />
    </>
  );
}
